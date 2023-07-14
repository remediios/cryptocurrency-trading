import styled from "styled-components";

export const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 25px;
  margin-top: 25px;
  padding-left: 50px;
`;

export const PredictionHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0px;
`;

export const PredictionResultContainer = styled.div`
  display: flex;
  align-items: baseline;
`;

export const PredictionResultHeader = styled.h4`
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
`;

export const PredictionResult = styled.p`
  font-size: 14px;
  font-weight: 800;
  color: ${(props) => {
    if (props.prediction === "increase") {
      return "green";
    } else if (props.prediction === "decrease") {
      return "red";
    } else if (props.prediction === "stay the same") {
      return "blue";
    } else {
      return "black"; // default color
    }
  }};
`;

export const SearchHistoryContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: 5px;
`;

export const SearchHistoryHeader = styled.h4`
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
  margin
`;

export const PopoverItemTitle = styled.p`
  font-weight: 600;
  font-size: 15px;
`;

export const PopoverItemTag = styled.p`
  font-size: 14px;
`;
