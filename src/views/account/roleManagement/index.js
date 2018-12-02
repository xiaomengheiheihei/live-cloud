import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import './index.scss'

class RoleManagement extends Component {

    render () {
        return (
            <div className="role-manage-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>账户管理</Breadcrumb.Item>
                    <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="role-manage-content">
                    <div className="role-manage-con-wrap">
                        <div className="left">

                        </div>
                        <div className="right">
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RoleManagement