import React, { useContext } from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { ContextAPI } from "../context/ContextAPI";

function NavigationBar() {
  const location = useLocation();
  const { setCurrencyName } = useContext(ContextAPI);

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
      <Menu.Item key="/">
        <NavLink exact to="/" activeClassName="active">
          Home
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/bitcoin">
        <NavLink
          to="/bitcoin"
          activeClassName="active"
          onClick={setCurrencyName("bitcoin")}
        >
          Bitcoin
        </NavLink>
      </Menu.Item>
      <Menu.Item key="/ethereum">
        <NavLink
          to="/ethereum"
          activeClassName="active"
          onClick={setCurrencyName("ethereum")}
        >
          Ethereum
        </NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default NavigationBar;
