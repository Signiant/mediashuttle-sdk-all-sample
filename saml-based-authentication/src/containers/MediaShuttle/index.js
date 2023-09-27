import React, { useReducer, Children, useEffect } from "react";
import { orderBy, capitalize } from "lodash";
import { toast } from "react-toastify";
import {
  setLoginRedirect,
  setAuthorizationCode,
  persistedLoginRedirect,
  persistedAuthCode
} from "redux/slices/auth";

import { Box, Grid, LinearProgress, Tooltip, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import Cancel from "@mui/icons-material/Cancel";

import DoneIcon from "@mui/icons-material/CheckCircle";

import {
  TransferEventType,
  MediaShuttleResourceFactory,
  RefreshingCredentials,
} from "@signiant/media-shuttle-sdk";

import AccountPortalPanel from "components/AccountPortalPanel";
import Table from "components/Table";
import Topbar from "components/Table/Topbar";
import DownloadDialog from "components/Table/DownloadDialog";

import MSLoader from "components/common/MSLoader";

import { get } from "utils/lodash";
import { handleError } from "utils/error";
import { isEmail } from "utils/validations";
import axios from "axios";
import config from "config";
import qs from 'qs';
import { useDispatch, useSelector } from "react-redux";

import T from "T";

const MediaShuttle = () => {
  const [localState, setLocalState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      accounts: [],
      portals: [],
      folders: [],
      folderContent: [],
      selectedAccount: null,
      selectedPortal: null,
      accountId: null,
      portalId: null,
      isAuthLoading: false,
      isAccountLoading: false,
      isPortalLoading: false,
      isTableLoading: false,
      breadCrumbsElements: [],
      page: T.INITIAL_PAGE,
      openDialog: false,
      fileTitle: "",
      credentials: {},
      currentObj: null,
      downloadList: [],
      inTransferFiles: [],
      canUpload: false,
      canDownload: false,
      canShowTable: false,
    }
  );

  const {
    password,
    accounts,
    portals,
    folders,
    folderContent,
    selectedAccount,
    selectedPortal,
    isTableLoading,
    isAuthLoading,
    isAccountLoading,
    isPortalLoading,
    breadCrumbsElements,
    page,
    openDialog,
    fileTitle,
    credentials,
    downloadList,
    inTransferFiles,
    canUpload,
    canDownload,
    canShowTable,
  } = localState;

    const loginRedirectFromStore = useSelector(persistedLoginRedirect);
    const authCodeFromStore = useSelector(persistedAuthCode);
    const dispatch = useDispatch()
    const signiantApi = config.signiantApi;

    useEffect(() => {
        if(accounts.length > 0) {
            return;
        }

        if(authCodeFromStore) {
            refreshToken();
        }
        else {
            getLoginRedirects();
        }
    }, [accounts]);

  const getLoginRedirects = () => {
    setLocalState({ isAuthLoading: true });
    const apiURL = (signiantApi.baseURL + signiantApi.loginRedirects)
    axios
    .get(apiURL, {
        params: {
            loginIdentifier: config.loginIdentifier,
            redirectURI: config.redirectURI,
            codeChallenge: config.codeChallenge
        }
    })
    .then(function (response) {
        if(response && response.data && response.data.loginRedirects) {
            const loginRedirect = response.data.loginRedirects[0]
            if(loginRedirect && loginRedirect.redirectURL) {
                dispatch(setLoginRedirect(loginRedirect))
                window.location.assign(loginRedirect.redirectURL);
            }
        }
    })
    .catch(function (error) {
        setLocalState({ isAuthLoading: false });
        console.error(error);
    });
  }

  const refreshToken = () => {
    setLocalState({ isAuthLoading: true });
    const {
        clientId,
        domain
    } = loginRedirectFromStore;

    if(clientId && domain && authCodeFromStore && config.redirectURI && config.codeVerifier) {
        axios({
                method: 'post',
                url: (domain + "/oauth2/token"),
                data: qs.stringify({
                    grant_type : config.grant_type,
                    client_id : clientId,
                    redirect_uri: config.redirectURI,
                    code: authCodeFromStore,
                    code_verifier: config.codeVerifier
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
        })
        .then(function (response) {
            if(response && response.data && response.data.refresh_token) {
                getAuthorizedAccounts(response.data.refresh_token)
            }
            else {
                setLocalState({ isAuthLoading: false });
                dispatch(setAuthorizationCode(null))
            }
        })
        .catch(function (error) {
            console.error(error);
            setLocalState({ isAuthLoading: false });
            dispatch(setAuthorizationCode(null))
        });
    }
    else {
        console.log('Missing required parameters to exchange authorization code with refresh token.')
        setLocalState({ isAuthLoading: false });
        dispatch(setAuthorizationCode(null))
    }
  }

  //  handles email and password change
  const onHandleChange = (event) => {
    const { name, value } = event.target;
    setLocalState({ [name]: value });
  };

  // API base call
  const platformApiEndpoint = process.env.PLATFORM_ENDPOINT;

  const getResourceFactory = (loginCredentials = credentials) => {
    const resourceFactory = new MediaShuttleResourceFactory(loginCredentials, {
      platformApiEndpoint,
    });

    return resourceFactory;
  };

  // return explorer
  const getExplorer = (loginCredentials = credentials) => {
    const resourceFactory = getResourceFactory(loginCredentials);
    return resourceFactory.getExplorer();
  };

  const getAuthorizedAccounts = (token) => {
    setLocalState({ isAuthLoading: true });
    const loginCredentials = new RefreshingCredentials({
            refreshToken: token,
            clientId: loginRedirectFromStore.clientId,
            domain: loginRedirectFromStore.domain,
        });

    // this next line are required to keep backward compatibility
    loginCredentials.baseUrl = platformApiEndpoint;
    const explorer = getExplorer(loginCredentials);

    explorer
      .listAccounts(true)
      .then((response) => {
        setLocalState({
          accounts: get(response, "mediaShuttleAccounts", []),
          isAuthLoading: false,
          credentials: loginCredentials,
        });
        toast.success(T.ACCOUNTS_LOADED);
        dispatch(setAuthorizationCode(null))
      })
      .catch((error) => {
        handleError(error);
        setLocalState({ isAuthLoading: false });
      });
  }

  // get portal records
  const getPortals = (value) => {
    const accountSelected = accounts.find((res) => res.accountId === value);
    setLocalState({ selectedAccount: accountSelected, isAccountLoading: true });

    const explorer = getExplorer();

    explorer
      .listPortals({
        accountId: get(accountSelected, "accountId", ""),
        serviceId: get(accountSelected, "serviceId", ""),
      })
      .then((portals) => {
        setLocalState({
          portals: portals.filter((portal) => portal.type === "Share"),
          isAccountLoading: false,
        });

        toast.success(T.PORTALS_LOADED);
      })
      .catch((error) => {
        handleError(error);
        setLocalState({ isAccountLoading: false });
      });
  };

  // get portals permissions
  const getPortalMemberPermissions = (value) => {
    const portalSelected = portals.find((res) => res.portalId === value);

    setLocalState({
      selectedPortal: portalSelected,
      isPortalLoading: true,
    });

    const explorer = getExplorer();

    explorer
      .getPortalMemberPermissions({
        accountId: get(selectedAccount, "accountId", null),
        serviceId: get(selectedAccount, "serviceId", null),
        portalId: get(portalSelected, "portalId", ""),
      })
      .then((portalPermissions) => {
        const selectedfolders = get(portalPermissions, "folders", []);
        const homeFolder = get(selectedfolders, "[0]", {});

        setLocalState({
          isPortalLoading: false,
          folders: selectedfolders,
          canUpload: get(homeFolder, "permissions.canUpload", false),
          canDownload: get(homeFolder, "permissions.canDownload", false),
        });

        getFolderContent(portalSelected, homeFolder);
      })
      .catch((error) => {
        handleError(error);
        setLocalState({
          isPortalLoading: false,
          isTableLoading: false,
        });
      });
  };

  // get table's data
  const getFolderContent = (
    portalSelected = selectedPortal,
    homeFolder = {},
    type = "root",
    path,
    isPop = false
  ) => {
    const payload = {
      accountId: get(selectedAccount, "accountId", null),
      serviceId: get(selectedAccount, "serviceId", null),
      portalId: get(portalSelected, "portalId", ""),
    };

    setLocalState({
      isTableLoading: true,
    });

    if (type === "root") payload.folderId = get(homeFolder, "id", "");
    else if (isPop) {
      breadCrumbsElements.pop();
      payload.browsePath = breadCrumbsElements.join("/");
    } else if (type === "subFolder") {
      payload.browsePath = breadCrumbsElements
        .filter(
          (data, index) =>
            index <= breadCrumbsElements.indexOf(path.split("/").pop())
        )
        .join("/");
    }

    if (type === "subFolder" || isPop)
      setLocalState({
        breadCrumbsElements:
          payload.browsePath.length > 0 ? payload.browsePath.split("/") : [],
      });

    const explorer = getExplorer();

    explorer
      .getFolderContent(payload)
      .then((folderContent) => {
        setLocalState({
          isTableLoading: false,
          folderContent: orderBy(
            folderContent,
            [(folder) => folder.path.toLowerCase()],
            ["asc"]
          ),
          canShowTable: true,
          page: T.INITIAL_PAGE,
        });
      })
      .catch((error) => {
        handleError(error);
        setLocalState({
          isTableLoading: false,
        });
      });
  };

  // resetting vars on account selection
  const resetDataOnAccountSelection = () => {
    setLocalState({
      breadCrumbsElements: [],
      portals: [],
      folders: [],
      folderContent: [],
      selectedPortal: null,
      canShowTable: false,
    });
  };

  // resetting vars on portal selection
  const resetDataOnPortalSelection = () => {
    setLocalState({
      breadCrumbsElements: [],
      folders: [],
      folderContent: [],
      canShowTable: false,
    });
  };

  // handles accounts and portals change
  const onHandleAutoCompleteChange = (type, value) => {
    setLocalState({ [type]: value });
    if (type === "accountId") {
      resetDataOnAccountSelection();
      getPortals(value);
    } else if (type === "portalId") {
      resetDataOnPortalSelection();
      getPortalMemberPermissions(value);
    }
  };

  // handles click on tables records i.e folders and files
  const handleTableRowClick = (isFolder, path, type) => {
    const breadcrumbPath = path.split("/").pop();

    if (isFolder) {
      let elements = breadCrumbsElements;

      if (breadcrumbPath && !elements.includes(breadcrumbPath))
        elements.push(breadcrumbPath);

      setLocalState({
        breadCrumbsElements: elements,
      });

      const isPop = type === "pop";

      getFolderContent(
        selectedPortal,
        folders,
        elements.length === 0 ? "root" : "subFolder",
        path,
        isPop
      );
    } else {
      setLocalState({
        openDialog: true,
        fileTitle: breadcrumbPath,
      });
    }
  };

  // handles breadcrumbs click
  const handleBreadCrumbClick = (element) => {
    handleTableRowClick(true, element, "push");
  };

  // handles click on home
  const getHomeRecords = () => {
    getFolderContent(selectedPortal, folders, "root");

    setLocalState({
      breadCrumbsElements: [],
    });
  };

  // handles refresh and up
  const handleClick = (action = "push") => {
    const elements = breadCrumbsElements;
    const path = elements.length > 0 ? elements[elements.length - 1] : "";
    handleTableRowClick(true, path, action);
  };

  // handles page change in case of pagination
  const handlePageChange = (e, value) => {
    setLocalState({
      folderContent,
      page: value,
    });
  };

  // return file size as integer
  const fileSizeAsInt = (fileSizeString) => {
    let fileSize = parseInt(fileSizeString);
    fileSize = isFinite(fileSize) ? fileSize : 0;
    return fileSize;
  };

  // handles subscription for upload and download
  const addSubscriptions = (subscriptionType, isDownload) => {
    const selectedFile = isDownload
      ? get(subscriptionType, "files", []).map((data) =>
          get(data, "filePath", "")
        )
      : get(subscriptionType, "_selectedFiles", []).map((data) =>
          get(data, "absoluteFilePath", "")
        );

    const record = {
      file: selectedFile.map((path) => path.split("/").pop()).join(", "),
      inProgress: true,
      type: isDownload ? "Download" : "Upload",
      progress: 10,
    };
    inTransferFiles.push(record);

    setLocalState({
      openDialog: false,
    });

    subscriptionType.subscribe(
      TransferEventType.TRANSFER_STARTING,
      ({ event: { eventData } }) => {
        record.transferId = get(subscriptionType, "_transferId", "");
        record.currentObj = subscriptionType;
        setLocalState({
          inTransferFiles,
        });
      }
    );

    subscriptionType.subscribe(
      TransferEventType.TRANSFER_PROGRESS,
      ({ event: { eventData } }) => {
        inTransferFiles.find(
          (data) => data.transferId === eventData.transferId
        ).progress = 60;
        setLocalState({
          inTransferFiles,
        });
      }
    );

    subscriptionType.subscribe(
      TransferEventType.TRANSFER_COMPLETED,
      ({ event: { type, eventData } }) => {
        const currentProgress = inTransferFiles.find(
          (data) => data.transferId === eventData.transferId
        );

        currentProgress.inProgress = false;
        currentProgress.progress = 100;

        currentProgress.status = T.SUCCESS;
        currentProgress.currentObj = null;

        setLocalState({
          downloadList: [],
          inTransferFiles,
        });

        if (
          !isDownload &&
          (breadCrumbsElements.length > 0
            ? breadCrumbsElements.join("/")
            : "/") === get(subscriptionType, "_destinationFolder", "")
        )
          handleClick(); // handles Table Refresh
      }
    );

    subscriptionType.subscribe(
      TransferEventType.TRANSFER_ERROR,
      ({ event: { eventData, message } }) => {
        toast.error(message);
        const currentProgress = inTransferFiles.find(
          (data) => data.transferId === eventData.transferId
        );
        currentProgress.progress = 0;
        currentProgress.inProgress = false;
        currentProgress.status = T.ERROR;
        currentProgress.currentObj = null;

        setLocalState({
          openDialog: false,
          downloadList: [],
          inTransferFiles,
        });
      }
    );

    subscriptionType.subscribe(
      TransferEventType.TRANSFER_CANCELED,
      ({ event: { eventData } }) => {
        setLocalState({
          openDialog: false,
          downloadList: [],
        });
      }
    );
  };

  // handles download
  const handleDownload = (files) => {
    const list = [...downloadList, files];

    setLocalState({
      downloadList: list,
    });

    const resourceFactory = getResourceFactory();

    const payload = {
      accountId: get(selectedAccount, "accountId", null),
      serviceId: get(selectedAccount, "serviceId", null),
      portalId: get(selectedPortal, "portalId", null),

      files: list.map((file) => ({
        filePath: file.path,
        fileSize: fileSizeAsInt(file.sizeInBytes),
      })),
      force: true,
    };

    resourceFactory.generateDownload(payload).then((download) => {
      download
        .selectDestinationFolder()
        .then(() => {
          download.start();
          addSubscriptions(download, true);
        })
        .catch((error) => {
          if (error.message === T.FOLDER_SELECTION_CANCELLED) {
            console.log(T.FOLDER_SELECTION_CANCELLED);
          } else {
            console.error(error);
          }
        });
    });
  };

  // handles upload
  const handleUpload = () => {
    const resourceFactory = getResourceFactory();
    const path =
      breadCrumbsElements.length > 0 ? breadCrumbsElements.join("/") : "/";

    const payload = {
      accountId: get(selectedAccount, "accountId", null),
      serviceId: get(selectedAccount, "serviceId", null),
      portalId: get(selectedPortal, "portalId", null),
      force: true,
      destinationPath: path,
    };

    resourceFactory.generateUpload(payload).then((uploader) => {
      // open a file selector and add files to the uploader
      uploader
        .addFiles()
        .then((files) => {
          addSubscriptions(uploader, false);
          // start uploading the selected files
          uploader.start();
        })
        .catch((error) => {
          if (error.message === T.FILE_SELECTION_CANCELLED) {
            console.log(T.FILE_SELECTION_CANCELLED);
          } else {
            console.error(error.message);
          }
        });
    });
  };

  // handles the cancellation of ongoing transfer
  const cancelOnGoingTransfer = (record) => {
    if (!record.transferId) {
      toast.error(T.TRANSFER_ID_NOT_GENERATED);
      return;
    }

    const currentSelection = get(record, "currentObj", null);

    if (currentSelection) {
      const currentProgress = inTransferFiles.find(
        (data) => data.transferId === currentSelection.transferId
      );
      currentProgress.progress = 100;
      currentProgress.inProgress = false;
      currentProgress.status = `${T.CANCEL}led`;
      currentProgress.currentObj = null;
      currentSelection.cancel();
      setLocalState({ inTransferFiles });
    }
  };

  // removes progress bar
  const handleFullScreen = () => {
    setLocalState({
      inTransferFiles: [],
    });
  };

  // returns current transfer status
  const getTransferFileStatus = (record) => {
    if (record.status === `${T.CANCEL}led`) return `${T.CANCEL}led`;
    return `${capitalize(record.type)}${record.inProgress ? "ing" : "ed"}`;
  };

  // returns the icon
  const getIcon = (record) => {
    if (record.status === `${T.CANCEL}led`)
      return <Cancel fontSize="18px" color="error" />;
    if (record.inProgress) {
      return <MSLoader size="15px" />;
    }
    return <DoneIcon fontSize="18px" color="success" />;
  };

  // return the file names
  const getFileName = (record) => {
    const fileRecords = get(record, "file", "");
    const fileType = get(record, "type", "");
    const files = fileRecords.split(", ");

    if (fileType === T.UPLOAD)
      return files.length > 1
        ? `${get(files, "[0]", "")} (+${files.length - 1} file(s))`
        : get(files, "[0]", "");
    else return files.pop();
  };

  if(isAuthLoading) {
    return <MSLoader size="30px" />;
  }
 else {
  return (
    (accounts.length > 0) &&  (<Box mt={2}>
      <AccountPortalPanel
        accounts={accounts}
        portals={portals}
        isAccountLoading={isAccountLoading}
        isPortalLoading={isPortalLoading}
        selectedAccount={selectedAccount}
        selectedPortal={selectedPortal}
        onHandleAutoCompleteChange={onHandleAutoCompleteChange}
      />

      {(canShowTable || isTableLoading) && (
        <Box sx={{ margin: "30px auto" }}>
          <Topbar
            breadCrumbsElements={breadCrumbsElements}
            getHomeRecords={getHomeRecords}
            canUpload={canUpload}
            handleBreadCrumbClick={handleBreadCrumbClick}
            handleClick={handleClick}
            handleUpload={handleUpload}
          />

          <Grid container spacing={4}>
            <Grid item md={inTransferFiles.length > 0 ? 8 : 12} xs={12}>
              <Table
                page={page}
                records={folderContent}
                isTableLoading={isTableLoading}
                handlePageChange={handlePageChange}
                handleTableRowClick={handleTableRowClick}
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <Box maxHeight="calc(100vh - 305px)" sx={{ overflowY: "auto" }}>
                {inTransferFiles.length > 0 &&
                  !inTransferFiles
                    .map((file) => file.inProgress)
                    .includes(true) && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: "pointer", textDecoration: "underline" }}
                      mb={1}
                      onClick={handleFullScreen}
                    >
                      {T.CLEAR_LOG}
                    </Typography>
                  )}

                {Children.toArray(
                  inTransferFiles &&
                    inTransferFiles.map((record, index) => {
                      return (
                        <Grid container mt={index > 0 ? 1 : 0}>
                          <Grid item xs={12}>
                            <Typography fontSize={12}>
                              {`${getTransferFileStatus(record)} ${getFileName(
                                record
                              )}`}
                            </Typography>
                          </Grid>

                          <Grid item xs={9} pt={0}>
                            <LinearProgress
                              sx={{
                                marginTop: 0.4,
                                height: 12,
                                borderRadius: 5,
                              }}
                              color={
                                record.status === `${T.CANCEL}led`
                                  ? "error"
                                  : "primary"
                              }
                              variant="determinate"
                              value={get(record, "progress", 0)}
                            />
                          </Grid>

                          <Grid item xs={1} ml={0.5}>
                            {getIcon(record)}
                          </Grid>

                          <Grid item xs={1} ml={0.5}>
                            {record.inProgress && (
                              <Tooltip title="Cancel the transfer">
                                <CancelIcon
                                  fontSize="18px"
                                  color="primary"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => cancelOnGoingTransfer(record)}
                                />
                              </Tooltip>
                            )}
                          </Grid>
                        </Grid>
                      );
                    })
                )}
              </Box>
            </Grid>
          </Grid>

          <DownloadDialog
            openDialog={openDialog}
            fileTitle={fileTitle}
            canDownload={canDownload}
            folderContent={folderContent}
            handleDownload={handleDownload}
            handleClose={() =>
              setLocalState({
                openDialog: false,
                isTableLoading: false,
              })
            }
          />
        </Box>
      )}
    </Box>)
  );
};}

export default MediaShuttle;
