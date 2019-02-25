import React, { Component } from 'react';
import { Layout, Spin } from 'antd';
import SliderTop from '../components/slider/top/top'
import MyMenu from '../components/slider/menu'
import Top from '../components/header/index'
import routers from '../../config/router'
import { Route, Switch } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import CommandDispatch from '../commandDispatch/index'

const { Header, Sider, Content } = Layout;

@inject("Root_store") @observer
class MyLayout extends Component {
    render () {
        return (
            <div>
                <Layout>
                    <Sider 
                        theme="light"  
                        collapsed={this.props.Root_store.collapsed}
                        style={{overflow: 'hidden', height: '100vh', position: 'fixed', left: 0}}
                        width="260">
                        <SliderTop></SliderTop>
                        <MyMenu></MyMenu>
                    </Sider>
                    <Layout style={this.props.Root_store.collapsed ? {marginLeft: 80} : {marginLeft: 260}}>
                        <Header style={{height: 70, padding: 0, background: '#fff'}} >
                            <Top></Top>
                        </Header>
                        <Route path="/commandDispatch" component={CommandDispatch} />
                        <Content>
                            <Switch>
                                {routers.map((item, i) => 
                                    <Route key={i} 
                                        path={item.path} 
                                        component={item.component} 
                                        exact
                                    /> 
                                )}
                            </Switch>
                        </Content>
                        <div className="my-spid">
                            <Spin size="large" />
                        </div>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default MyLayout;