import { CHANGE_CURRENTPATIENTDATA } from "../constant";

// 一些共享数据传输的reducer
const initdata = { currentPatientData: {} }; //默认值，用户信息
export default function datatransfer(preState = initdata, action) {
  const { type, data } = action;
  switch (type) {
    case CHANGE_CURRENTPATIENTDATA: //data为一个对象
      return { ...preState, currentPatientData: data };
    default:
      return preState;
  }
}
