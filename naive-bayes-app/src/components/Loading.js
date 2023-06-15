import React from "react";
import { Space, Spin } from "antd";

function Loading() {
  return (
    <>
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
    </>
  );
}

export default Loading;
