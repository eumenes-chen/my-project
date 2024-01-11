import Http from "./Http";
const http = `http://127.0.0.1:9090/api`;

import $http from "./Http";

class calendarApi {
  // 获取日期数据
  getDate(data) {
    return $http({
      url: `${http}/getdate`,
      method: "get",
      params: data,
    });
  }
  // 编辑角色
  editDate(data) {
    return $http({
      url: `${http}/editdate`,
      method: "post",
      data: data,
    });
  }
  // 删除角色
  deleteDate(data) {
    return $http({
      url: `${http}/deletedate`,
      method: "post",
      data: data,
    });
  }
  // 根据关键词查询日期
  searchDate(data) {
    return $http({
      url: `${http}/searchdate`,
      method: "post",
      data: data,
    });
  }
}

export default new calendarApi();
