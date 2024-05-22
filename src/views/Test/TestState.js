const testState = {
    list: [],
    create:function(param) {
        console.log('param',param);
        let item = {name:'张三',duty:'战士'}
        this.list.push(item)
        return item;
    }
}

export default testState;