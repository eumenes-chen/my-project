import Http from "./Http";
const http = `http://127.0.0.1:9090/api`;

import $http from "./Http";

// export const character = (data) => {
//   return $http({
//     url: `${http}/character`,
//     method: "get",
//     data: data,
//   });
// };
class sanguoApi {
  // 获取所有角色
  character(data) {
    return $http({
      url: `${http}/character`,
      method: "get",
      params: data,
    });
  }
  // 获取指定角色
  getCharacter(data) {
    return $http({
      url: `${http}/getcharacter`,
      method: "post",
      data: data,
    });
  }
  // 根据关键词查询指定角色
  searchCharacter(data) {
    return $http({
      url: `${http}/searchcharacter`,
      method: "post",
      data: data,
    });
  }
  // 添加角色
  addCharacter(data) {
    console.log('执行这里',data);
    return $http({
      url: `${http}/addcharacter`,
      method: "post",
      data: data,
    });
  }
  // 编辑角色
  editCharacter(data) {
    return $http({
      url: `${http}/editcharacter`,
      method: "post",
      data: data,
    });
  }
  // 删除角色
  deleteCharacter(data) {
    return $http({
      url: `${http}/deletecharacter`,
      method: "post",
      data: data,
    });
  }
  // 增加展示在框中的角色
  addViewCharacter(data) {
    return $http({
      url: `${http}/addviewcharacter`,
      method: "post",
      data: data,
    });
  }
  // 移除展示在框中的角色
  deleteViewCharacter(data) {
    return $http({
      url: `${http}/deleteviewcharacter`,
      method: "post",
      data: data,
    });
  }
  // 清空展示在框中的角色
  clearViewCharacter() {
    return $http({
      url: `${http}/clearviewcharacter`,
      method: "post"
    });
  }

  // 获取消息mock数据
  getMessage(data) {
    return $http({
      url: `http://localhost:9091/api/message`,
      method: "get",
      params: data,
    });
  }
}

// class Api extends Http {
//     // 获取角色
//     character(data) {
//         let url = `${http}/character`
//         return this.get(url, data)
//     }
//     // 获取指定角色
//     getCharacter(data) {
//         let url = `${http}/getcharacter`
//         return this.post(url, data)
//     }
//     // 根据关键词查询指定角色
//     searchCharacter(data) {
//         let url = `${http}/searchcharacter`
//         return this.post(url, data)
//     }
//     //添加角色
//     addCharacter(data) {
//         let url = `${http}/addcharacter`
//         return this.post(url, data)
//     }
//     //编辑角色
//     editCharacter(data) {
//         let url = `${http}/editcharacter`
//         return this.post(url, data)
//     }
//     //删除角色
//     deleteCharacter(data) {
//         let url = `${http}/deletecharacter`
//         return this.post(url, data)
//     }

//     // 获取name
//     getView() {
//         let url = `${http}/view`
//         return this.get(url)
//     }
//     //添加name
//     addView(data) {
//         let url = `${http}/addview`
//         return this.post(url, data)
//     }
//     //删除name
//     deleteView(data) {
//         let url = `${http}/deleteview`
//         return this.post(url, data)
//     }
//     //删除全部name
//     deleteAllView() {
//         let url = `${http}/deleteallview`
//         return this.post(url)
//     }

//     //获取消息mock数据
//     getMessage() {
//         let url = `http://localhost:9091/api/message`
//         return this.get(url)
//     }
// }

export default new sanguoApi();
