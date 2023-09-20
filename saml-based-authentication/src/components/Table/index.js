import React from "react";
import PropTypes from "prop-types";
import noop from "lodash/noop";

import {
  Card,
  Table as TableView,
  TableContainer,
  Box,
  Pagination,
  styled,
} from "@mui/material";

import T from "T";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

const MSPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPagination-ul li button": {
    fontSize: 14,
  },
  "& .MuiPagination-ul li button.Mui-selected": {
    background: "#1976d2",
    color: "white",
  },
}));

const Table = ({
  page = T.INITIAL_PAGE,
  records = [],
  isTableLoading = false,
  handleTableRowClick = noop,
  handlePageChange = noop,
}) => {
  return (
    <Card sx={{ margin: "auto" }}>
      <TableContainer
        sx={{ maxHeight: "calc(100vh - 305px)", overflowY: "auto" }}
      >
        <TableView stickyHeader>
          <TableHeader columns={[T.TYPE, T.NAME]} />
          <TableBody
            page={page}
            records={records}
            isTableLoading={isTableLoading}
            handleTableRowClick={handleTableRowClick}
          />
        </TableView>
      </TableContainer>
    </Card>
  );
};

Table.propTypes = {
  page: PropTypes.number,
  records: PropTypes.array,
  isTableLoading: PropTypes.bool,
  handleTableRowClick: PropTypes.func,
  handlePageChange: PropTypes.func,
};

export default Table;
