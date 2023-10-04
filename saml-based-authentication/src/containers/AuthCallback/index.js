import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthorizationCode } from "redux/slices/auth";

const AuthCallback = () => {
    const dispatch = useDispatch()
    const queryParams = new URLSearchParams(window.location.search)
    const authCode = queryParams.get("code")

    if(authCode) {
        dispatch(setAuthorizationCode(authCode))
        window.location.assign("/");
    }

    return (
        <div/>
    );

};

export default AuthCallback;
