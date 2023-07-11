import React, { useContext, useEffect, useState } from "react";
import { Image, Button, Progress } from "antd";
import { CSVLink } from "react-csv";
import { Typography } from "antd";
import { ContextAPI } from "../../context/ContextAPI";
import axios from "axios";

function TableHeader({
  currencyImg,
  currencySymbol,
  csvData,
  csvHeaders,
  currency,
}) {
  const { Title } = Typography;
  const { currencyName, currencyData, currencyID } = useContext(ContextAPI);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setShowProgress(false);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setShowProgress(false);
    //eslint-disable-next-line
  }, [currencyID]);

  const submitData = async (data) => {
    try {
      setLoading(true);
      setProgress(0);
      setShowProgress(true);
      const response = await axios.post(
        `http://127.0.0.1:5000/api/update/${currencyID}`,
        data,
        {
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setTimeout(() => {
              setProgress(percentage);
            }, 500);
          },
        }
      );
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          paddingBottom: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image src={currencyImg} width={40} height={40} alt={currencyName} />
        <Title style={{ marginLeft: "10px" }}>
          {currencyName} Historical Data ({currencySymbol})
        </Title>
        <Button
          type="primary"
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            height: "25px",
            width: "70px",
            fontSize: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`${currency}_data.csv`}
          >
            Export CSV
          </CSVLink>
        </Button>
        <Button
          type="primary"
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            height: "25px",
            width: "80px",
            fontSize: "10px",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() => submitData(currencyData)}
        >
          Update Model
        </Button>
        {showProgress ? (
          <Progress
            percent={progress}
            type="circle"
            size={[25, 20]}
            style={{ marginLeft: "10px", marginTop: "8px" }}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default TableHeader;
