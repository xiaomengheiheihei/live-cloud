import {observable, action, useStrict, runInAction} from 'mobx'
import { observer } from 'mobx-react'

useStrict(true)
class ROOT_State {
    @observable collapsed = false
    @action changeMenu = (status) => {
        this.collapsed = status
    }
}

export default new ROOT_State()