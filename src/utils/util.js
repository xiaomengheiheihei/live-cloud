import React from 'react';
import * as QNRTC from 'pili-rtc-web';

/**
 * 
 * deayload page
 * @param {*}  
 */
export const  DelayLoading = ({ pastDelay, error }) => {
    if (pastDelay) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    } else {
        return null;
    }
}

/**
 * 
 * 动态插入css
 */
export const loadStyle = url => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
}

/**
 * 
 * 动态插入脚本
 */
export const loadScript = url => {
    const script = document.createElement('script')
    script.type = 'application/javascript'
    script.src = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(script)
}

/**
 * 
 * qiniu-sdk订阅函数
 */
export const subscribeUser = (myRTC, user) => {
    // 如果用户没有发布就直接返回
    if (!user.published) {
      return;
    }
    // 注意这里订阅使用了 Promise 的写法而没有用 async/await
    // 因为在我们 Demo 中并没有依赖订阅这个操作的后续操作
    // 即没有操作必须等到订阅操作结束之后再运行
    myRTC.subscribe(user.userId).then(remoteStream => {
      // 我们在 room 页面上准备用来显示远端媒体流的元素
      const remotePlayer = document.getElementById('remoteplayer');
      // 在我们准备的元素上播放远端媒体流
      remoteStream.play(remotePlayer);
    }).catch(e => {
      console.log('subscribe error!', e);
    });
}