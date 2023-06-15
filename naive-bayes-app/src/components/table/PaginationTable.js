import React from "react";
import { Pagination } from "antd";

function PaginationTable({
  currentPage,
  onShowSizeChange,
  handlePageChange,
  currencyData,
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          total={currencyData.length}
          //pageSize={rowsPerPage}
          onShowSizeChange={onShowSizeChange}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
}

export default PaginationTable;
