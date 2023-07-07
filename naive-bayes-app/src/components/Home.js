import React, { useContext, useEffect, useState } from "react";
import { Select, Button } from "antd";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { CryptoChart } from "../config/chart/api";
import { ContextAPI } from "../context/ContextAPI";
import {
  ButtonWrapper,
  ChartCointainer,
  ChartTitleWrapper,
  CrytoTitle,
  DataSupplier,
} from "../styles/dashboard";
import datasuplier from "../img/datasuplier.png";
import { buttonOptions } from "../config/chart/buttons";
import ChartButton from "./chart/ChartButton";
import { selectOptions } from "../config/chart/selectOptions";
import Loading from "./Loading";

function Home() {
  ChartJS.register(...registerables);
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState(365);
  const { currencyID, setCurrencyID } = useContext(ContextAPI);
  const [chartContent, setChartContent] = useState("price");
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, [days, currencyID, chartContent]);

  useEffect(() => {
    setCurrencyID("bitcoin");
    //eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CryptoChart(currencyID, days));
      const data = response.data.prices;
      const chartLabels = data.map((coin) => {
        let date = new Date(coin[0]);
        let time =
          date.getHours() > 12
            ? `${date.getHours() - 12}:${date.getMinutes()} PM`
            : `${date.getHours()}:${date.getMinutes()} AM`;
        return days === 1 ? time : date.toLocaleDateString();
      });
      const chartPrices = data.map((item) => item[1]);

      const marketCapData = response.data.market_caps;
      const marketCapChartData = marketCapData.map((item) => item[1]);

      const totalVolumeData = response.data.total_volumes;
      const totalVolumeChartData = totalVolumeData.map((item) => item[1]);

      if (chartContent === "price") {
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `Price (Past ${days} Days) in GBP £`,
              data: chartPrices,
              borderColor: "rgb(21, 117, 252, 1)",
              backgroundColor: "rgb(21, 117, 252, 0.2)",
              fill: true,
            },
          ],
        });
      } else if (chartContent === "marketcap") {
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `Market Capitalisation (Past ${days} Days) in GBP £`,
              data: marketCapChartData,
              borderColor: "rgb(255, 99, 132, 1)",
              backgroundColor: "rgb(255, 99, 132, 0.2)",
              fill: true,
            },
          ],
        });
      } else if (chartContent === "totalvolume") {
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `Total Volume (Past ${days} Days)`,
              data: totalVolumeChartData,
              borderColor: "rgb(250, 209, 4, 1)",
              backgroundColor: "rgb(250, 209, 4, 0.2)",
              fill: true,
            },
          ],
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleChange = (value) => {
    setChartContent(value);
  };

  return (
    <>
      <ChartCointainer>
        {!chartData ? (
          <Loading margin={0} />
        ) : (
          <>
            <ChartTitleWrapper>
              <CrytoTitle> {currencyID.toUpperCase()}</CrytoTitle>
              <a
                href="https://www.coingecko.com/en"
                target="_blank"
                rel="noreferrer"
              >
                <DataSupplier src={datasuplier} href="www.google.com" />
              </a>
              <Select
                defaultValue="price"
                style={{
                  width: 130,
                }}
                onChange={handleChange}
                options={selectOptions}
              />
              <Button
                type="dashed"
                style={{ marginLeft: 15, width: 100 }}
                onClick={() =>
                  currencyID === "bitcoin"
                    ? setCurrencyID("ethereum")
                    : setCurrencyID("bitcoin")
                }
              >
                {currencyID === "bitcoin" ? "ETHEREUM" : "BITCOIN"}
              </Button>
            </ChartTitleWrapper>
            <Line
              data={chartData}
              options={{
                elements: {
                  point: {
                    radius: 2,
                  },
                },
              }}
            />
            <ButtonWrapper>
              {buttonOptions.map((day) => (
                <ChartButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </ChartButton>
              ))}
            </ButtonWrapper>
          </>
        )}
      </ChartCointainer>
    </>
  );
}

export default Home;
