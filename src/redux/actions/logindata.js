import { CHANGE_LOGIN_STATES, CHANGE_ACCOUNT_MESSAGE } from "../constant";
export const changeLoginState = (data) => ({ type: CHANGE_LOGIN_STATES, data });
export const changeAccountMessage = (data) => ({
  type: CHANGE_ACCOUNT_MESSAGE,
  data,
});
