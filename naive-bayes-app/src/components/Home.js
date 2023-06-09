import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

function Home() {
  return (
    <div>
      <nav>
        <Link to="/bitcoin">
          <Button type="primary">Bitcoin</Button>
        </Link>
        <Link to="/ethereum">
          <Button type="primary">Ethereum</Button>
        </Link>
      </nav>
    </div>
  );
}

export default Home;
