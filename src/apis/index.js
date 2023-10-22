import Http from './Http'

class Api extends Http {
    // 获取角色
    character(data) {
        let url = "http://localhost:9090/api/character"
        return this.get(url, data)
    }
    // 获取指定角色
    getCharacter(data) {
        let url = "http://localhost:9090/api/getcharacter"
        return this.post(url, data)
    }
    // 根据关键词查询指定角色
    searchCharacter(data) {
        let url = "http://localhost:9090/api/searchcharacter"
        return this.post(url, data)
    }
    //添加角色
    addCharacter(data) {
        let url = "http://localhost:9090/api/addcharacter"
        return this.post(url, data)
    }
    //编辑角色
    editCharacter(data) {
        let url = "http://localhost:9090/api/editcharacter"
        return this.post(url, data)
    }
    //删除角色
    deleteCharacter(data) {
        let url = "http://localhost:9090/api/deletecharacter"
        return this.post(url, data)
    }


    // 获取name
    getView() {
        let url = "http://localhost:9090/api/view"
        return this.get(url)
    }
    //添加name
    addView(data) {
        let url = "http://localhost:9090/api/addview"
        return this.post(url, data)
    }
    //删除name
    deleteView(data) {
        let url = "http://localhost:9090/api/deleteview"
        return this.post(url, data)
    }
    //删除全部name
    deleteAllView() {
        let url = "http://localhost:9090/api/deleteallview"
        return this.post(url)
    }


    //获取消息mock数据
    getMessage() {
        let url = "http://localhost:9091/api/message"
        return this.get(url)
    }
}

export default new Api