import React from 'react';

import {RequestHelper} from 'app/requesthelper';

let requestHelper = new RequestHelper('/video/?latest=1', config.refreshRates.video);


const Video = React.createClass({
    getInitialState() {
        return {
            'yt_video_id': ''
        }
    },

    componentDidMount() {
        this.setState(requestHelper.data);
        requestHelper.start(function (result) {
            this.setState(result);
        }.bind(this));
    },

    componentWillUnmount() {
        requestHelper.stop();
    },

    render() {
        let videoElement;
        if (this.state.yt_video_id) {
            videoElement = (
                <iframe className="videoIframe" frameBorder="0" allowFullScreen={true}
                        src={"https://www.youtube.com/embed/" + this.state.yt_video_id}>
                </iframe>
            )
        } else {
            videoElement = (
                <h1>
                    No video yet
                </h1>
            )
        }

        return (
            <div>
                {videoElement}
            </div>
        )
    }
});

export default Video;
