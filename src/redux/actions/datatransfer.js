import {
  CHANGE_CURRENTPATIENTDATA,
} from "../constant";
export const changeCurrentpatientdata = (data) => ({
  type: CHANGE_CURRENTPATIENTDATA,
  data,
});
