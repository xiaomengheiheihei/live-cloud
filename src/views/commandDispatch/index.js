import React from "react";
import './index.scss'
import { Table } from 'antd';
import {Map, Marker} from 'react-bmap'

class CommandDispatch extends React.Component {
    
    state = {
        deviceList: [
            {
                name: '张德广的无人机',
                phone: 18811226633,
                id: '222',
                canTalk: 0
            },
            {
                name: '李二傻的手机',
                phone: 18811226633,
                id: '111',
                canTalk: 1
            },
            {
                name: '大二傻的手机',
                phone: 18811226633,
                id: '333',
                canTalk: 0
            }
        ],
        todayProject: [
            {
                name: '肌肉型男 他们不是健身教练 他们是人民的守护者',
                startTime: '12:22:33',
                status: 0
            },
            {
                name: '肌肉型男 他们不是健身教练 他们是人民的守护者2',
                startTime: '12:22:33',
                status: 0
            },
            {
                name: '肌肉型男 他们不是健身教练 他们是人民的守护者222',
                startTime: '12:22:33',
                status: 0
            }
        ],
        columns: [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
                width: '200px'
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: '状态',
                dataIndex: '',
                key: 'status',
                render: text => (<span>
                    {text === 0 ? "已结束" : text === 1 ? "进行中" : "未开始"}
                </span>)
            }
        ]
    }

    componentDidMount () {
        document.querySelector('.command-dispathc-wrap').style.height = (document.body.clientHeight - 70) + 'px' 
    }
    showDeviceList = () => {
        
    }

    render () {
        return (
            <div className="command-dispathc-wrap">
                <div className="device-list-wrap">
                    <h2>在线设备</h2>
                    <ul className="deviceList">
                        {
                            this.state.deviceList.length > 0 && this.state.deviceList.map(item => (
                                <li className="item" key={item.id}>
                                    <div className="name">
                                        <span className="name-circle">{item.name.slice(0,1)}</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="tel">{item.phone}</span>
                                        {
                                            item.canTalk === 0 ? 
                                            <span className="no-talk">设备位置信息无法获取</span> :
                                            <span className="button"><i className={'iconfont live-cloud-gaode'}></i>视频通信</span>
                                        }
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <Map style={{height: '100%'}} center={{lng: 116.402544, lat: 39.928216}} zoom="11">
                    <Marker title="111" position={{lng: 116.402544, lat: 39.928216}}>
                        <div 
                            onClick={this.showDeviceList} 
                            style={{width: '40px', height: '40px', borderRadius: '50%', lineHeight: '40px', background: 'red', textAlign: 'center'}}>李</div>
                    </Marker>
                    {/* <NavigationControl />  */}
                    {/* <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/> */}
                </Map>
                <div className="command-dispathc-left">
                    <div className="live-wrap">
                        <div className="top">
                            <h3>直播巡检</h3>
                            <span className="more">全部画面</span>
                        </div>
                        <div className="live-content">

                        </div>
                    </div>
                    <div className="today-pro live-wrap">
                        <div className="top">
                            <h3>今日项目</h3>
                            <span className="more">全部项目</span>
                        </div>
                        <Table 
                            rowKey={record => record.name + record.startTime} 
                            columns={this.state.columns} 
                            pagination={{showQuickJumper: true,size: "small", total: 20}}
                            dataSource={this.state.todayProject} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CommandDispatch