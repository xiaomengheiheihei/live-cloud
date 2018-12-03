import {observable, action} from 'mobx'

class ROOT_State {
    @observable collapsed = false
    @action changeMenu = (status) => {
        this.collapsed = status
    }
}

export default new ROOT_State()