import { CHANGE_LOGIN_STATES, CHANGE_ACCOUNT_MESSAGE } from "../constant";

// 登录状态的 reduce
const initdata = {
  loginStates: false,
  account: null,
  admin: null,
  user_name: null,
  details: null,
}; //默认值,登录状态、登录信息（登陆后才有）
export default function logindataReducer(preState = initdata, action) {
  const { type, data } = action;
  switch (type) {
    case CHANGE_LOGIN_STATES:
      return { ...preState, loginStates: data };
    case CHANGE_ACCOUNT_MESSAGE:
      return { ...preState, ...data };
    default:
      return preState;
  }
}
