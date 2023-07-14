import React, { useState } from "react";
import { Image, List, Popover } from "antd";
import {
  PopoverItemTag,
  PopoverItemTitle,
  SearchHistoryContainer,
  SearchHistoryHeader,
} from "../../styles/prediction";
import bitcoin from "../../img/bitcoin.png";
import ethereum from "../../img/ethereum.png";

function SearchHistory({ history }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const getImageByCurrency = (currency) => {
    switch (currency) {
      case "bitcoin":
        return bitcoin;
      case "ethereum":
        return ethereum;
      default:
        return bitcoin;
    }
  };

  const handleItemHover = (item) => {
    setHoveredItem(item);
    setPopoverVisible(true);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
    setPopoverVisible(false);
  };

  const handlePopoverVisibleChange = (visible) => {
    setPopoverVisible(visible);
  };

  const content = (
    <div>
      {hoveredItem && (
        <>
          <PopoverItemTitle>Search Result</PopoverItemTitle>
          <PopoverItemTag>Price: {hoveredItem.price}</PopoverItemTag>
          <PopoverItemTag>Market Cap: {hoveredItem.marketCap}</PopoverItemTag>
          <PopoverItemTag>
            Total Volume: {hoveredItem.totalVolume}
          </PopoverItemTag>
          <PopoverItemTag>Change 24hr: {hoveredItem.change24h}</PopoverItemTag>
          <PopoverItemTag>Change 7d: {hoveredItem.change7d}</PopoverItemTag>
        </>
      )}
    </div>
  );

  return (
    <>
      <SearchHistoryContainer>
        <SearchHistoryHeader>History:</SearchHistoryHeader>
        <List
          size="small"
          bordered
          dataSource={history.slice().reverse()}
          style={{ border: "none" }}
          renderItem={(item) => (
            <Popover
              content={content}
              open={popoverVisible && hoveredItem === item}
              trigger="hover"
              onOpenChange={handlePopoverVisibleChange}
              overlayStyle={{ padding: 0, margin: 0 }}
            >
              <List.Item
                style={{
                  display: "inline-block",
                  padding: "5px",
                  alignItems: "baseline",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  marginLeft: "10px",
                }}
                onMouseEnter={() => handleItemHover(item)}
                onMouseLeave={handleItemLeave}
              >
                <Image
                  src={getImageByCurrency(item.currency)}
                  style={{
                    height: 20,
                    width: 20,
                    marginBottom: 3,
                    marginRight: 5,
                  }}
                />
                {item.predictionLabel}
              </List.Item>
            </Popover>
          )}
        />
      </SearchHistoryContainer>
    </>
  );
}

export default SearchHistory;
