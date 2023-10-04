import React from "react";
import PropTypes from "prop-types";
import noop from 'lodash/noop'

import Dialog from "@mui/material/Dialog";

const MSDialog = ({
  open = false,
  handleClose = noop,
  children,
}) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableEscapeKeyDown
    >
      {children}
    </Dialog>
  );
};

MSDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default MSDialog;
