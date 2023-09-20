import React from "react";
import PropTypes from "prop-types";
import noop from "lodash/noop";

import { Box, Button } from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";

import MSTextField from "components/common/MSTextField";

import MSLoader from "components/common/MSLoader";

import T from "T";

const AuthenticationPanel = ({
  username = "",
  password = "",
  accounts = [],
  isLoading = false,
  onHandleChange = noop,
  handleSubmit = noop,
}) => {
  return (
    <Box display="flex">
      <MSTextField
        label={`${T.USERNAME}: `}
        placeholder={T.USERNAME}
        size="small"
        variant="outlined"
        name="username"
        value={username}
        onChange={onHandleChange}
      />

      <MSTextField
        label={`${T.PASSWORD}: `}
        placeholder={T.PASSWORD}
        id="outlined-password-input"
        type="password"
        name="password"
        sx={{
          ml: 8,
        }}
        value={password}
        size="small"
        onChange={onHandleChange}
      />

      {isLoading && <MSLoader />}

      <Button
        variant="outlined"
        size="small"
        onClick={handleSubmit}
        disabled={accounts.length > 0}
        endIcon={accounts.length > 0 ? <DoneIcon size="20px" /> : ""}
        sx={{minWidth: 'min-content'}}
      >
        {accounts.length > 0 ? `${T.AUTHENTICATE}d` : T.AUTHENTICATE}
      </Button>
    </Box>
  );
};

AuthenticationPanel.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  accounts: PropTypes.array,
  isLoading: PropTypes.bool,
  onHandleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};
export default AuthenticationPanel;
