import React, { Children } from "react";
import PropTypes from "prop-types";

import { Skeleton, TableRow, TableCell } from "@mui/material";

const TableSkeleton = ({ rows = 1, columns = 1, ...rest }) => {
  const skeltonRows = Array(rows).fill("");
  const skeltonColumns = Array(columns).fill("");

  return Children.toArray(
    skeltonRows.map(() => (
      <TableRow>
        {Children.toArray(
          skeltonColumns.map(() => (
            <TableCell {...rest}>
              <Skeleton variant="rect" />
            </TableCell>
          ))
        )}
      </TableRow>
    ))
  );
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};

export default TableSkeleton;
