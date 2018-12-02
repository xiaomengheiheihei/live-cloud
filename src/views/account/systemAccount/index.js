import React, { Component } from 'react';
import { Input, Button, Breadcrumb, Table, Modal } from 'antd';
// import { withRouter, Link } from 'react-router-dom'
import './index.scss'

const Search = Input.Search;

class SystemAccount extends Component {

    state = {
        columns: [
            {
                title: '账号',
                dataIndex: 'account',
                key: 'account',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                key: 'tel',
            },
            {
                title: '角色',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'op',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={() => this.changeItem(record)} style={{marginRight: 10}} size="small">修改</Button>
                        <Button type="danger" onClick={() => this.deleteItem(record)} style={{marginRight: 10}} size="small">删除</Button>
                    </span>
                )
            },
        ],
        data: [
            {
                account: 'TEL-8',
                name: '小泽老师',
                tel: '18823439876',
                status: '推流中'
            }
        ],
        modalTitle: '',
        visible: false,
    }

    changeItem = (record) => {
        this.setState({
            modalTitle: '修改账号',
            visible: true
        })
    }

    deleteItem = (record) => {

    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    addAccount = () => {
        this.setState({
            modalTitle: '添加账号',
            visible: true
        })
    }
    render () {
        return (
            <div className="system-account-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>账号管理</Breadcrumb.Item>
                    <Breadcrumb.Item>系统账号</Breadcrumb.Item>
                </Breadcrumb>
                <div  className="system-account-content">
                    <Button type="primary" onClick={this.addAccount} style={{margin: '20px 0'}}>添加账号</Button>
                    <div className="system-account-list-wrap">
                    <div className="top clear">
                            <h3 className="list-title">系统账号</h3>
                            <div className="right">
                                <Search
                                    placeholder="输入姓名或账号"
                                    onSearch={value => console.log(value)}
                                    style={{ width: 200 }}
                                />
                            </div>
                        </div>
                        <Table 
                            rowKey={record => record.tel} 
                            columns={this.state.columns} 
                            dataSource={this.state.data}
                            pagination={{showQuickJumper: true, showSizeChanger: true}} />
                    </div>
                </div>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.system-account-wrap')}
                    onCancel={this.handleCancel}
                    >
                    <div className="modal-wrap">
                        <section className="item">
                            <label htmlFor="username">姓名：</label>
                            <Input style={{width: '70%'}} id="username" placeholder="请输入姓名" />
                        </section>
                        <section className="item">
                            <label htmlFor="tel">联系方式：</label>
                            <Input type="tel" style={{width: '70%'}} id="tel" placeholder="请输入联系方式" />
                        </section>
                        <section className="item">
                            <label htmlFor="accountNum">账号：</label>
                            <Input style={{width: '70%'}} id="accountNum" placeholder="请输入账号" />
                        </section>
                        <section className="item">
                            <label htmlFor="password">密码：</label>
                            <Input type="password" style={{width: '70%'}} id="password" placeholder="请输入密码" />
                        </section>
                        <section className="item">
                            <label htmlFor="ss">角色：</label>
                            <Input style={{width: '70%'}} id="ss" placeholder="请输入账号" />
                        </section>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default SystemAccount