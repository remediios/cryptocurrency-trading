import React from "react";
import { Button } from "../../styles/dashboard";

const ChartButton = ({ children, selected, onClick }) => {
  return (
    <Button onClick={onClick} selected={selected}>
      {children}
    </Button>
  );
};

export default ChartButton;
