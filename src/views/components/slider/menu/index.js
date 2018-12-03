import React, { Component } from 'react';
import { Menu } from 'antd';
import sliderConfig from '../../../../config/slider'
import './index.scss'
import { withRouter } from 'react-router-dom'

const SubMenu = Menu.SubMenu;

@withRouter
class MyMenu extends Component {
    state = {
        keys: [],
    }
    selectKey = () =>{
        let keys = []
        // if ((sliderConfig.find(i => i.key === this.props.history.location.pathname)) === undefined) {
        //     console.log(this.props.history.location.pathname)
        //     keys.push('/' + this.props.history.location.pathname.split('/')[2])
        //     console.log(keys)
        //     this.setState({keys:keys})
        //     return
        // }
        keys.push(this.props.history.location.pathname)
        this.setState({keys:keys})
    }
    componentWillMount() {
        this.selectKey()
    }
    onSelect = ({ key }) =>{
        this.props.history.push(key)
    }
    componentWillReceiveProps (nextProps){
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.selectKey()
        }
    }
    render () {
        const menuIcon = {
            marginRight: '30px'
        }
        return (
            <div className="menu-wrap">
                <Menu
                    mode="inline"
                    theme="dark"
                    onSelect={this.onSelect} 
                    selectedKeys={this.state.keys}
                    >
                    {
                        sliderConfig.map((item, i) => (
                            item.list && item.list.length > 0 &&
                            <SubMenu key={item.key}
                                title={<span><i style={menuIcon} className={'iconfont live-cloud-' + item.icon}></i><span>{item.title}</span></span>}
                            >
                                {item.list.map((listItem,ii)=>
                                    <Menu.Item key={item.key+listItem.key}>
                                        <span>{listItem.title}</span>
                                    </Menu.Item>
                                )}
                            </SubMenu>
                        ))
                    }
                </Menu>
            </div>
        )
    }
}

export default MyMenu