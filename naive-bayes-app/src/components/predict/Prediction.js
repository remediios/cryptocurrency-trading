import React, { useState, useEffect, useContext } from "react";
import {
  PredictionContainer,
  PredictionHeader,
  PredictionResult,
  PredictionResultContainer,
  PredictionResultHeader,
} from "../../styles/prediction";
import { Form, InputNumber, Button, Image } from "antd";
import { ContextAPI } from "../../context/ContextAPI";
import { CryptoInfo } from "../../config/chart/api";
import axios from "axios";
import SearchHistory from "./SearchHistory";
import RealTimePrediction from "./RealTimePrediction";

function Prediction() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const {
    currencySymbol,
    setCurrencySymbol,
    currencyID,
    currencyImg,
    setCurrencyImg,
  } = useContext(ContextAPI);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [prediction, setPrediction] = useState("---");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    forceUpdate({});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currencyID === "bitcoin") {
      setCurrencySymbol("BTC");
    } else if (currencyID === "ethereum") {
      setCurrencySymbol("ETH");
    } else {
      setCurrencySymbol("");
    }
    // eslint-disable-next-line
  }, [currencyID]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currencyID, currencyImg]);

  const onFinish = (values) => {
    const data = [values];
    const payload = {
      currency: currencyID,
      data: data,
    };
    submitData(payload);
    console.log(payload);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CryptoInfo(currencyID));
      const data = response.data;
      const currencyImage = data.image.small;
      setCurrencyImg(currencyImage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const submitData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:5000/api/predict/daily",
        data
      );
      console.log(response);
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

      const { price, marketCap, totalVolume, change24h, change7d } =
        data.data[0];
      setPrediction(predictionLabel);
      addToSearchHistory({
        currency: currencyID,
        predictionLabel: predictionLabel,
        price: price,
        marketCap: marketCap,
        totalVolume: totalVolume,
        change24h: change24h,
        change7d: change7d,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
    }
  };

  const addToSearchHistory = (prediction) => {
    const newSearchHistory = [...searchHistory, prediction];
    setSearchHistory(newSearchHistory);
  };

  return (
    <>
      <PredictionContainer>
        <PredictionHeader>
          {!loading ? (
            <Image
              src={currencyImg}
              style={{
                height: 30,
                width: 30,
                marginRight: 6,
                marginBottom: 8,
              }}
            />
          ) : undefined}
          CRYPTOCURRENCY PRICE MOVEMENT PREDICTION
        </PredictionHeader>
        <SearchHistory history={searchHistory} />
        <Form
          form={form}
          fields={[
            { name: ["price"], value: undefined },
            { name: ["marketCap"], value: undefined },
            { name: ["totalVolume"], value: undefined },
            { name: ["change24h"], value: undefined },
            { name: ["change7d"], value: undefined },
          ]}
          name="prediction_form"
          layout="inline"
          onFinish={onFinish}
          style={{
            marginTop: 8,
          }}
        >
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: "Please input value!",
              },
            ]}
            style={{ width: 200 }}
          >
            <InputNumber min={0} addonBefore="Price" addonAfter="£" />
          </Form.Item>
          <Form.Item
            name="marketCap"
            rules={[
              {
                required: true,
                message: "Please input value!",
              },
            ]}
            style={{ width: 240 }}
          >
            <InputNumber min={0} addonBefore="Market Cap" addonAfter="£" />
          </Form.Item>
          <Form.Item
            name="totalVolume"
            rules={[
              {
                required: true,
                message: "Please input value!",
              },
            ]}
            style={{ width: 260 }}
          >
            <InputNumber
              min={0}
              addonBefore="Total Volume"
              addonAfter={currencySymbol.toUpperCase()}
            />
          </Form.Item>
          <Form.Item
            name="change24h"
            rules={[
              {
                required: true,
                message: "Please input value!",
              },
            ]}
            style={{ width: 220 }}
          >
            <InputNumber addonBefore="24hr Change" addonAfter="%" />
          </Form.Item>
          <Form.Item
            name="change7d"
            rules={[
              {
                required: true,
                message: "Please input value!",
              },
            ]}
            style={{ width: 200 }}
          >
            <InputNumber addonBefore="7d Change" addonAfter="%" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Predict
              </Button>
            )}
          </Form.Item>
        </Form>
        <PredictionResultContainer>
          <PredictionResultHeader>Prediction :</PredictionResultHeader>
          <PredictionResult prediction={prediction}>
            {!loading
              ? prediction !== null
                ? prediction.toUpperCase()
                : "No prediction"
              : "Loading..."}{" "}
          </PredictionResult>
        </PredictionResultContainer>
        <RealTimePrediction prediction={prediction} />
      </PredictionContainer>
    </>
  );
}

export default Prediction;
