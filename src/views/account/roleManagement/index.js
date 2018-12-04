import React, { Component } from 'react';
import { Breadcrumb, Button, Tree } from 'antd';
import './index.scss'

const { TreeNode } = Tree;

class RoleManagement extends Component {

    state = {
        roleList: [
            {
                id: 1,
                title: '超级管理员',
                Jurisdiction: {

                }
            },
            {
                id: 2,
                title: '直播管理员',
                Jurisdiction: {
                    
                }
            }
        ],
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
        checkedKeys: ['device'],
        selectedKeys: [],
        treeDisable: true
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
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
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
                            <div className="top">
                                <span className="title">角色列表</span>
                                <span className="create-btn">+ 创建</span>
                            </div>
                            <ul className="role-list">
                                {
                                    this.state.roleList.map((item) => (
                                        <li key={ item.id } className="item">{ item.title }</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="right">
                            <div className="top"><Button>编辑</Button></div>
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
            </div>
        )
    }
}

export default RoleManagement