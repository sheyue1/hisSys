import axios from "axios";
// 正式环境
const baseURL = "http://47.93.211.232:8080";
// mock环境
// const baseURL = "http://127.0.0.1:4523/mock/816613";
/**
 *
 *
 * @export
 * @param {*} method
 * @param {*} url
 * @param {*} params
 * @param {*} data
 * @return {*}
 */
export default function request(method, url, params, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      baseURL,
      params,
      data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 *
 * @param {*} doc_level 挂号级别
 * @param {*} ref_type  挂号类别
 * @param {*} is_buy_rec 是否购买病历
 */
export function calfare(doc_level, ref_type, is_buy_rec) {
  let count = 0;

  switch (doc_level) {
    case "主治医师":
      count = count + 5;
      break;
    case "副主任医师":
      count = count + 6;
      break;
    case "主任医师":
      count = count + 7;
      break;
    case "普通医师":
      count = count + 4;
      break;
    default:
  }
  switch (ref_type) {
    case "门诊":
      count = count + 1;
      break;
    case "急诊":
      count = count + 2;
      break;
    case "特诊":
      count = count + 3;
      break;
    default:
  }
  if (is_buy_rec) {
    return count + 2.5;
  }
  return count + 0.5;
}
/**
 *
 *
 * @param {*} cur 当前拥有的权限
 * @param {*} use 想要操作的权限
 */
export function accessControl(cur, use) {
  // 挂号员、门诊医生、药品管理员、系统管理员
  return cur === "系统管理员" ? false : cur !== use;
}
