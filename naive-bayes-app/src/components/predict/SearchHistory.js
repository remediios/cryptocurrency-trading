import React from "react";
import { List } from "antd";
import {
  SearchHistoryContainer,
  SearchHistoryHeader,
} from "../../styles/prediction";

function SearchHistory({ history }) {
  if (history.length === 0) {
    return null;
  }
  return (
    <>
      <SearchHistoryContainer>
        <SearchHistoryHeader>History:</SearchHistoryHeader>
        <List
          size="small"
          bordered
          dataSource={history.slice().reverse()} // Reverse the history array
          renderItem={(item) => (
            <List.Item style={{ display: "inline-block", marginLeft: "10px" }}>
              {item}
            </List.Item>
          )}
        />
      </SearchHistoryContainer>
    </>
  );
}

export default SearchHistory;
