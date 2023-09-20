import React from "react";
import noop from "lodash/noop";
import PropTypes from "prop-types";

import { Button, Divider, Typography, Stack, Box } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import { format } from "date-fns";

import MSDialog from "components/common/MSDialog";

import T from "T";

import { get } from "utils/lodash";

const DownloadDialog = ({
  openDialog = false,
  fileTitle = "",
  canDownload = false,
  folderContent = [],
  handleDownload = noop,
  handleClose = noop,
}) => {
  const record = folderContent.find((content) =>
    content.path.includes(fileTitle)
  );

  return (
    <MSDialog open={openDialog}>
      <CloseIcon
        onClick={handleClose}
        fontSize="small"
        sx={{
          color: (theme) => theme.palette.grey[500],
          textAlign: "right",
          position: "absolute",
          top: 6,
          right: 6,
          cursor: "pointer",
        }}
      />
      <Typography
        fontSize={14}
        fontWeight={600}
        textAlign="center"
        p={`6px 100px`}
      >
        {fileTitle}
      </Typography>

      <Divider />

      <Stack p={2}>
        <Box display="flex">
          <Typography variant="body2">{T.SIZE}: </Typography>
          <Typography variant="body2" ml={7.5}>
            {get(record, "sizeInBytes", "") / 1000} {` ${T.KB}`}
          </Typography>
        </Box>

        <Box display="flex" mt={1}>
          <Typography variant="body2">{T.MODIFIED_ON}: </Typography>
          <Typography variant="body2" ml={1.2}>
            {" "}
            {format(
              new Date(get(record, "lastModifiedOn", null)),
              "MMMM dd, yyyy h:m a"
            )}
          </Typography>
        </Box>

        <Box display="flex" mt={1}>
          <Typography variant="body2">{T.PATH}: </Typography>
          <Typography variant="body2" ml={7.5} sx={{ wordBreak: "break-word" }}>
            {get(record, "path", "")}
          </Typography>
        </Box>

        {canDownload && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleDownload(record)}
            sx={{
              display: "flex",
              margin: "auto",
              mt: 3,
              alignContent: "center",
            }}
          >
            <DownloadOutlinedIcon fontSize="small" sx={{ mr: 0.4 }} />
            {T.DOWNLOAD}
          </Button>
        )}
      </Stack>
    </MSDialog>
  );
};

DownloadDialog.propTypes = {
  openDialog: PropTypes.bool,
  fileTitle: PropTypes.string,
  canDownload: PropTypes.bool,
  folderContent: PropTypes.array,
  handleDownload: PropTypes.func,
  handleClose: PropTypes.func,
};

export default DownloadDialog;
