import styled from "styled-components";

export const ChartCointainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 25px;
  padding: 50px;
`;

export const ChartTitleWrapper = styled.div`
  width: 100%;
  margin: 0;
`;

export const CrytoTitle = styled.h3`
  margin: 0 auto;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  width: 30%;
  &:hover {
    font-weight: 500;
  }
`;

export const DataSupplier = styled.img`
  margin: 0 auto;
  width: 80px;
  float: right;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: space-around;
`;

export const Button = styled.button`
  width: 12%;
  border: 1px solid rgba(36, 44, 92);
  border-radius: 5px;
  padding: 10px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: ${({ selected }) =>
    selected ? "rgba(36, 44, 92)" : "white"};
  color: ${({ selected }) => (selected ? "white" : "")};
  font-weight: ${({ selected }) => (selected ? 700 : 500)};
  &:hover {
    background-color: rgba(36, 44, 92);
    color: white;
    transition: 0.2s all ease-in-out;
    cursor: pointer;
  }
`;
