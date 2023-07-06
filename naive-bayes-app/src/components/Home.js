import React, { useContext, useEffect, useState } from "react";
import { Button, Spin } from "antd";
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

function Home() {
  ChartJS.register(...registerables);
  const [chartData, setChartData] = useState(null);
  //eslint-disable-next-line
  const [days, setDays] = useState(365);
  //eslint-disable-next-line
  const { currencyName, setCurrencyName } = useContext(ContextAPI);

  useEffect(() => {
    setCurrencyName("bitcoin");
    fetchData();
    //eslint-disable-next-line
  }, [days, currencyName]);

  const fetchData = async () => {
    try {
      const response = await axios.get(CryptoChart(currencyName, days));
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <ChartCointainer>
        {!chartData ? (
          <>
            <Spin size="large" />
          </>
        ) : (
          <>
            <ChartTitleWrapper>
              <CrytoTitle> {currencyName.toUpperCase()}</CrytoTitle>
              <a
                href="https://www.coingecko.com/en"
                target="_blank"
                rel="noreferrer"
              >
                <DataSupplier src={datasuplier} href="www.google.com" />
              </a>
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
            <ButtonWrapper style={{}}>
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
