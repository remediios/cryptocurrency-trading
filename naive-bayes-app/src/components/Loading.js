import React from "react";
import { Space, Spin } from "antd";

function Loading({ margin }) {
  return (
    <>
      <Space
        size="middle"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: `${margin}px`,
        }}
      >
        <Spin size="large" />
      </Space>
    </>
  );
}

export default Loading;
