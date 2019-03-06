import React, { Component } from 'react';
import { Button, Tree, message, Modal, Input, Icon } from 'antd';
import http from '../../../utils/http'
import './index.scss'

const { TreeNode } = Tree;

class RoleManagement extends Component {

    state = {
        roleList: [],
        data: [
            {
                title: '设备管理',
                key: 'device',
                children: [
                    {
                        title: '设备列表',
                        key: 'devicelist',
                        children: [
                            { title: '设备回放', key: 'devicereplay' },
                        ],
                    }
                ]
            },
            {
                title: '直播管理',
                key: 'live',
                children: [
                    {
                        title: '直播列表',
                        key: 'livelist',
                        children: [
                            { title: '云导播', key: 'ybk' },
                            { title: 'h5发布', key: 'h5page' },
                            { title: '设备回放', key: 'projectreplay' },
                        ],
                    },
                    {
                        title: '录像管理',
                        key: 'replaymean',
                    },
                    {
                        title: '台标管理',
                        key: 'logo',
                    }
                ]
            },
            {
                title: '账号管理',
                key: 'account',
                children: [
                    {
                        title: '系统账号',
                        key: 'sysAccount',
                        // children: [
                        //     { title: '设备回放', key: 'devicereplay' },
                        // ],
                    }
                ]
            }
        ],
        autoExpandParent: true,
        checkedKeys: ['device', 'live', 'account'],
        selectedKeys: [],
        treeDisable: true,
        visible: false,
        addRoleName: ''
    }

    componentDidMount () {
        this.getList()
    }

    getList () {
        http.get('/api/role/list', {})
        .then(res => {
            if (res.code === 200) {
                this.setState({roleList: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
    }

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    }

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })

    addRole = () => {
        this.setState({visible: true})
    }

    handleOk = () => {
        http.post('/api/role/add', {name: this.state.addRoleName})
        .then(res => {
            if (res.code === 200) {
                message.success('添加成功！')
                this.getList()
                this.handleCancel()
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    handleCancel = () => {
        this.setState({addRoleName: '', visible: false})
    }

    addRoleNamechange = (e) => {
        const value = e.target.value
        this.setState({addRoleName: value})
    }

    render () {
        return (
            <div className="role-manage-wrap">
                <div className="role-manage-content">
                    <div className="item-top-wrap">
                        <h3>角色管理</h3>
                        <div className="item-top-b">
                            <Button 
                                type="primary" 
                                onClick={this.addRole} 
                                style={{margin: ' 0'}}
                            >+创建角色</Button>
                            <Icon type="form" />
                        </div>
                    </div>
                    <div className="role-manage-con-wrap">
                        <div className="left">
                            <div className="top">
                                <span className="title">角色列表</span>
                            </div>
                            <ul className="role-list">
                                {
                                    this.state.roleList.map((item) => (
                                        <li key={ item.id } className="item">{ item.name }</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="right">
                            <div className="top">管理表单</div>
                            <div className="tree-wrap">
                                <Tree
                                    checkable
                                    onExpand={this.onExpand}
                                    autoExpandParent={this.state.autoExpandParent}
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    onSelect={this.onSelect}
                                    disabled={this.state.treeDisable}
                                    selectedKeys={this.state.selectedKeys}
                                >
                                    {this.renderTreeNodes(this.state.data)}
                                </Tree>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title={'创建角色'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.role-manage-wrap')}
                    onCancel={this.handleCancel}
                    >
                    <Input value={this.state.addRoleName} onChange={this.addRoleNamechange} placeholder="请输入角色名称" />
                </Modal>
            </div>
        )
    }
}

export default RoleManagement