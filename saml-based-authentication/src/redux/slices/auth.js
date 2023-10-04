import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loginRedirect: null,
    authorizationCode: null
  },
  reducers: {
    setLoginRedirect: (state, action) => {
      state.loginRedirect = action.payload;
    },
    setAuthorizationCode: (state, action) => {
      state.authorizationCode = action.payload;
    },
  },
})

export const { setLoginRedirect, setAuthorizationCode } = authSlice.actions
export const persistedLoginRedirect = state => state.loginRedirect;
export const persistedAuthCode = state => state.authorizationCode;
export default authSlice.reducer