import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Table, Pagination, Space, Spin, Image } from "antd";
import { Typography } from "antd";
import { columns } from "./columns";
import { ContextAPI } from "../context/ContextAPI";

function Data({ currency }) {
  const [currencyData, setCurrencyData] = useState([]);
  const [currencyImg, setCurrencyImg] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [labelData, setLabelData] = useState([]);

  const { Title } = Typography;
  const { currencyName, setCurrencyName } = useContext(ContextAPI);

  useEffect(() => {
    async function getBitcoinHistoricalData() {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${currency}/market_chart`,
          {
            params: {
              vs_currency: "gbp",
              days: "3000",
              interval: "daily",
            },
          }
        );

        const response2 = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${currency}/`,
          {
            params: {
              vs_currency: "gbp",
              days: "max",
            },
          }
        );
        const { prices, market_caps, total_volumes } = response.data;
        const { name, symbol, image } = response2.data;

        const formattedData = prices.map(([timestamp, price], index) => {
          const currentDate = new Date(timestamp).toLocaleString();
          const previousPrice = index > 0 ? prices[index - 1][1] : "-";
          const priceChange =
            index > 0 ? ((price - previousPrice) / previousPrice) * 100 : 0;
          const percentageChange7d =
            index > 6
              ? ((price - prices[index - 7][1]) / prices[index - 7][1]) * 100
              : 0;

          // Calculate price difference with the previous data point
          const previousPriceLabel = index > 0 ? prices[index - 1][1] : null;
          const priceDifferenceLabel = previousPriceLabel
            ? price - previousPriceLabel
            : 0;

          // Label the data point based on the price difference
          let label;
          if (priceDifferenceLabel > 0.005) {
            label = "increase";
          } else if (priceDifferenceLabel < -0.005) {
            label = "decrease";
          } else {
            label = "stay the same";
          }

          return {
            id: index + 1,
            date: currentDate,
            price,
            marketCap: market_caps[index][1],
            totalVolume: total_volumes[index][1],
            change24h: priceChange.toFixed(2),
            change7d: percentageChange7d.toFixed(2),
            label,
          };
        });

        setCurrencyData(formattedData);
        setLabelData(formattedData);
        setCurrencyName(name);
        setCurrencyImg(image.small);
        setCurrencySymbol(symbol.toUpperCase());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Bitcoin historical data:", error.message);
        setIsLoading(false);
      }
    }

    getBitcoinHistoricalData();
    // eslint-disable-next-line
  }, [currencyName]);

  // Calculate the index of the last row to display based on the current page and rows per page
  const lastIndex = currentPage * rowsPerPage;
  // Calculate the index of the first row to display
  const firstIndex = lastIndex - rowsPerPage;
  // Slice the currencyData array to get the rows for the current page
  const currentRows = currencyData.slice(firstIndex, lastIndex);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onShowSizeChange = (current, pageSize) => {
    setRowsPerPage(pageSize);
  };

  return (
    <div>
      {isLoading ? (
        <Space
          size="middle"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Spin size="large" />
        </Space>
      ) : currencyData.length > 0 ? (
        <>
          <div style={{ padding: "20px", marginBottom: "10px" }}>
            <div
              style={{
                paddingBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                src={currencyImg}
                width={40}
                height={40}
                alt={currencyName}
              />
              <Title style={{ marginLeft: "10px" }}>
                {currencyName} Historical Data ({currencySymbol})
              </Title>
            </div>
            <Table
              columns={columns}
              dataSource={currentRows}
              pagination={false}
              bordered
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <Pagination
                defaultCurrent={1}
                current={currentPage}
                total={currencyData.length}
                //pageSize={rowsPerPage}
                onShowSizeChange={onShowSizeChange}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </>
      ) : (
        <p>No Bitcoin data available.</p>
      )}
    </div>
  );
}

export default Data;
