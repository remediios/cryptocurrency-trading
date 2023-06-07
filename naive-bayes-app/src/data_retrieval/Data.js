import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination } from "antd";

function Data() {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    async function getBitcoinHistoricalData() {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
          {
            params: {
              vs_currency: "gbp",
              days: "90", // Retrieve data for the last 90 days
            },
          }
        );

        const { prices } = response.data;
        // Extract the timestamps and prices from the nested array
        const formattedData = prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleString(),
          price,
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
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Price (USD)",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div>
      <h1>Bitcoin Historical Data</h1>
      {isLoading ? (
        <p>Loading Bitcoin data...</p>
      ) : bitcoinData.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={currentRows}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            total={bitcoinData.length}
            pageSize={rowsPerPage}
            onChange={handlePageChange}
          />
        </>
      ) : (
        <p>No Bitcoin data available.</p>
      )}
    </div>
  );
}

export default Data;
