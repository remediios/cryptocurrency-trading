import styled from "styled-components";

export const TableWrapper = styled.div`
  margin-top: 20px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  background-color: #f2f2f2;
  font-weight: bold;
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
`;

export const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;
