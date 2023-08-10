import React, { Children } from "react";
import PropTypes from "prop-types";

import { TableRow, TableHead, TableCell, Typography } from "@mui/material";

import { memo } from "utils/react";

const TableHeader = ({ columns = [] }) => {
  return (
    <TableHead>
      <TableRow>
        {Children.toArray(
          columns.map((column) => {
            return (
              <TableCell sx={{ background: "aliceblue", p: "10px 16px" }}>
                <Typography
                  variant="body1"
                  fontSize={14}
                  noWrap
                  fontWeight={600}
                >
                  {column}
                </Typography>
              </TableCell>
            );
          })
        )}
      </TableRow>
    </TableHead>
  );
};

TableHeader.propTypes = {
  columns: PropTypes.array,
};

export default memo(TableHeader);
