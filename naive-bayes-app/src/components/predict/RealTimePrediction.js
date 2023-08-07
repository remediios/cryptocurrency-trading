import React, { useContext, useEffect, useState } from "react";
import {
  PredictionResult,
  PredictionResultContainer,
  PredictionResultHeader,
} from "../../styles/prediction";
import axios from "axios";
import { ContextAPI } from "../../context/ContextAPI";

function RealTimePrediction() {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({});
  const [prediction, setPrediction] = useState("---");

  const { currencyID } = useContext(ContextAPI);

  useEffect(() => {
    const fetchLatestPriceRecord = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${currencyID}/market_chart`,
          {
            params: {
              vs_currency: "gbp",
              days: 90,
            },
          }
        );

        const recordData = response.data;
        const { prices, market_caps, total_volumes } = recordData;
        const lastIndex = prices.length - 1;

        const price = lastIndex > 0 ? prices[lastIndex][1] : "-";
        const previousPrice = lastIndex > 0 ? prices[lastIndex - 1][1] : "-";
        const priceChange =
          lastIndex > 0 ? ((price - previousPrice) / previousPrice) * 100 : 0;

        const percentageChange7d =
          lastIndex > 6
            ? ((price - prices[lastIndex - 7][1]) / prices[lastIndex - 7][1]) *
              100
            : 0;

        const payload = {
          currency: currencyID,
          data: [
            {
              price: prices[lastIndex][1],
              marketCap: market_caps[lastIndex][1],
              totalVolume: total_volumes[lastIndex][1],
              change24h: priceChange,
              change7d: percentageChange7d,
            },
          ],
        };

        setPayload(payload);
        submitData(payload);
      } catch (error) {
        console.error("Error fetching latest price record:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPriceRecord();
    // eslint-disable-next-line
  }, [currencyID, prediction]);

  const submitData = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      const response = await axios.post(
        "http://127.0.0.1:5000/api/predict/hourly",
        data
      );
      const prediction = response.data.response;
      let predictionLabel;

      switch (prediction) {
        case 0:
          predictionLabel = "decrease";
          break;
        case 1:
          predictionLabel = "increase";
          break;
        case 2:
          predictionLabel = "stay the same";
          break;
        default:
          predictionLabel = "";
      }

      setPrediction(predictionLabel);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <PredictionResultContainer>
        <PredictionResultHeader>Real-Time Prediction :</PredictionResultHeader>
        <p style={{ fontSize: "14px", marginRight: "5px" }}>
          The next price movement prediction is
        </p>
        <PredictionResult prediction={prediction}>
          {loading ? "Loading..." : prediction}
        </PredictionResult>
      </PredictionResultContainer>
    </>
  );
}

export default RealTimePrediction;
