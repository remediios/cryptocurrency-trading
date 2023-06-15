import React from "react";
import { Image, Button } from "antd";
import { CSVLink } from "react-csv";
import { Typography } from "antd";

function TableHeader({
  currencyImg,
  currencyName,
  currencySymbol,
  csvData,
  csvHeaders,
  currency,
}) {
  const { Title } = Typography;

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
      </div>
    </>
  );
}

export default TableHeader;
