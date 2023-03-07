import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logindataReducer from "./reduxs/logindata";
import datatransfer from "./reduxs/datatransfer";

// 合并多个reducer
const allReducers = combineReducers({
  logindata: logindataReducer,
  datatransfer,
});
export default createStore(allReducers, applyMiddleware(thunk));
