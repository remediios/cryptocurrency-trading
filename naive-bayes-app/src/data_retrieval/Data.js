import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Space, Spin } from "antd";
import { Typography } from "antd";

function Data() {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { Title } = Typography;

  useEffect(() => {
    async function getBitcoinHistoricalData() {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
          {
            params: {
              vs_currency: "usd",
              days: "365", // Retrieve data for the last 90 days
            },
          }
        );

        const { prices, market_caps, total_volumes } = response.data;
        // Extract the timestamps, prices, market caps, and total volumes from the nested arrays
        const formattedData = prices.map(([timestamp, price], index) => ({
          id: index + 1,
          date: new Date(timestamp).toLocaleString(),
          open: index === 0 ? price : prices[index - 1][1],
          close: index === prices.length - 1 ? price : prices[index + 1][1],
          price,
          marketCap: market_caps[index][1],
          totalVolume: total_volumes[index][1],
        }));

        // Store the formatted data in the state array
        setBitcoinData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Bitcoin historical data:", error.message);
      }
    }

    getBitcoinHistoricalData();
  }, []);

  // Calculate the index of the last row to display based on the current page and rows per page
  const lastIndex = currentPage * rowsPerPage;
  // Calculate the index of the first row to display
  const firstIndex = lastIndex - rowsPerPage;
  // Slice the bitcoinData array to get the rows for the current page
  const currentRows = bitcoinData.slice(firstIndex, lastIndex);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Define the columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Open Price (GBP)",
      dataIndex: "open",
      key: "open",
    },
    {
      title: "Close Price (GBP)",
      dataIndex: "close",
      key: "close",
    },
    {
      title: "Price (GBP)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Market Cap (GBP)",
      dataIndex: "marketCap",
      key: "marketCap",
    },
    {
      title: "Total Volume",
      dataIndex: "totalVolume",
      key: "totalVolume",
    },
  ];

  return (
    <div>
      <Title>Bitcoin Historical Data</Title>
      {isLoading ? (
        <Space
          size="middle"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </Space>
      ) : bitcoinData.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={currentRows}
            pagination={false}
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
              total={bitcoinData.length}
              pageSize={rowsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p>No Bitcoin data available.</p>
      )}
    </div>
  );
}

export default Data;
