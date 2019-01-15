import React from 'react';
import './player.scss'
import VideoJs from 'video.js'
require('video.js/dist/video-js.css')
require('videojs-flash');

const videojs = window.videojs || VideoJs

class Player extends React.Component {
    state = {

    }
    video = React.createRef();
    player = null
    componentDidMount () {
        this.initVideoPlayer();
    }
    initVideoPlayer () {
        let option = {
            sources: this.props.sources
        }
        Object.assign(option, this.props.playerOption)
        const playerid = this.video.current;
        this.player = videojs(playerid, option, ()=> {
            videojs.log('Your player is ready!');
        })
    }
    componentWillUnmount () {
        this.player.dispose();
    }
    render () {
        return (
            <div id="react-player"><video className="video-js" ref={this.video}></video></div>
        )
    }
}

export default Player