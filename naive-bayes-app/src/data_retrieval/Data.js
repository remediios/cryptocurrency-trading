import React, { useEffect, useState } from "react";
import axios from "axios";

function Data() {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getBitcoinHistoricalData() {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
          {
            params: {
              vs_currency: "gbp",
              days: "90", // Retrieve data for the last 30 days
            },
          }
        );

        const { prices } = response.data;
        // Extract the timestamps and prices from the nested array
        const formattedData = prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
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

  return (
    <div>
      <h1>Bitcoin Historical Data</h1>
      {isLoading ? (
        <p>Loading Bitcoin data...</p>
      ) : bitcoinData.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <td>Date</td>
              <td>Price (USD)</td>
            </tr>
            {bitcoinData.map((dataPoint, index) => (
              <tr key={index}>
                <td>{dataPoint.date}</td>
                <td>{dataPoint.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Bitcoin data available.</p>
      )}
    </div>
  );
}

export default Data;
