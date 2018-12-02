import React, { Component } from 'react';
import { Layout } from 'antd';
import SliderTop from '../components/slider/top/top'
import MyMenu from '../components/slider/menu'
import Top from '../components/header/index'
import routers from '../../config/router'
import { Route, Switch } from 'react-router-dom'

const { Header, Sider, Content } = Layout;

class MyLayout extends Component {
    render () {
        return (
            <div>
                <Layout>
                    <Sider 
                        theme="light"  
                        style={{overflow: 'hidden', height: '100vh', position: 'fixed', left: 0}}
                        width="260">
                        <SliderTop></SliderTop>
                        <MyMenu></MyMenu>
                    </Sider>
                    <Layout style={{marginLeft: 260}}>
                        <Header style={{height: 70, padding: 0, background: '#fff'}} >
                            <Top></Top>
                        </Header>
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
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default MyLayout;