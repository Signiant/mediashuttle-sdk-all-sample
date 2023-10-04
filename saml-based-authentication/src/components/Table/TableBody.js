import React, { Children } from "react";
import noop from "lodash/noop";
import PropTypes from "prop-types";

import {
  TableRow,
  TableCell,
  Typography,
  TableBody as TBody,
} from "@mui/material";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

import TableSkeleton from "./TableSkeleton";

import T from "T";

import { memo } from "utils/react";
import { get } from "utils/lodash";

const TableBody = ({
  page = T.INITIAL_PAGE,
  records = [],
  isTableLoading = false,
  handleTableRowClick = noop,
}) => {
  const getFileTypeIcon = (ext) =>
    ["jpg", "jpeg", "png", "gif"].includes(ext) ? (
      <CameraAltOutlinedIcon />
    ) : (
      <TextSnippetOutlinedIcon />
    );

  return (
    <TBody>
      {isTableLoading && <TableSkeleton rows={3} columns={2} />}
      {!isTableLoading &&
        Children.toArray(
          records.map((record) => {
            const isFolder = get(record, "isDirectory", false);
            const path = get(record, "path", "");
            const title = path.split("/").pop();

            return (
              <TableRow>
                <TableCell
                  sx={{
                    p: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isFolder ? (
                    <FolderOutlinedIcon />
                  ) : (
                    getFileTypeIcon(path.split(".").pop())
                  )}
                </TableCell>
                <TableCell
                  sx={{ p: "10px 16px", cursor: "pointer" }}
                  onClick={() => handleTableRowClick(isFolder, path, "push")}
                >
                  {title}
                </TableCell>
              </TableRow>
            );
          })
        )}

      {!isTableLoading && records && records.length === 0 && (
        <TableRow>
          <TableCell colSpan="10%" sx={{ border: "none" }}>
            <Typography variant="body1" textAlign="center">
              {T.NO_RECORDS}
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TBody>
  );
};

TableBody.propTypes = {
  page: PropTypes.number,
  isTableLoading: PropTypes.bool,
  records: PropTypes.array,
  handleTableRowClick: PropTypes.func,
};

export default memo(TableBody);
