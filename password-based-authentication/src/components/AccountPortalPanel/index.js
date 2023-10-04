import React from "react";
import PropTypes from "prop-types";
import { noop, get } from "lodash";

import Box from "@mui/material/Box";

import MSAutocomplete from "components/common/MSAutocomplete";

import T from "T";
import MSLoader from "components/common/MSLoader";

const AccountPortalPanel = ({
  accounts = [],
  portals = [],
  selectedAccount = null,
  selectedPortal = null,
  isAccountLoading = false,
  isPortalLoading = false,
  onHandleAutoCompleteChange = noop,
}) => {
  return (
    <Box display="flex" mt={3}>
      <MSAutocomplete
        label={`${T.ACCOUNT}: `}
        placeholder={T.SELECT}
        listDetails={accounts}
        value={selectedAccount}
        disabled={accounts.length === 0}
        getByLabelText={(option) => get(option, "name", "")}
        onHandleChange={(event, newValue) =>
          onHandleAutoCompleteChange(
            "accountId",
            get(newValue, "accountId", "")
          )
        }
      />

      {isAccountLoading && <MSLoader />}

      <MSAutocomplete
        label={`${T.PORTAL}: `}
        placeholder={T.SELECT}
        listDetails={portals}
        value={selectedPortal}
        disabled={portals.length === 0}
        getByLabelText={(option) => get(option, "name", "")}
        onHandleChange={(event, newValue) =>
          onHandleAutoCompleteChange("portalId", get(newValue, "portalId", ""))
        }
      />

      {isPortalLoading && <MSLoader />}
    </Box>
  );
};

AccountPortalPanel.propTypes = {
  accounts: PropTypes.array,
  portals: PropTypes.array,
  isAccountLoading: PropTypes.bool,
  isPortalLoading: PropTypes.bool,
  selectedAccount: PropTypes.object,
  selectedPortal: PropTypes.object,
  onHandleAutoCompleteChange: PropTypes.func,
};
export default AccountPortalPanel;
