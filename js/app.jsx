import React from 'react';
import { RaisedButton, AppBar, LeftNav, List, ListItem } from 'material-ui'
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import '../scss/main.scss';

let SelectableList = SelectableContainerEnhance(List);

const AppLeftNav = React.createClass({
    propTypes: {
        location: React.PropTypes.object.isRequired,
        onRequestChangeList: React.PropTypes.func.isRequired
    },

    render() {
        const {
            location,
            onRequestChangeList
        } = this.props;

        return (
            <LeftNav className="app-left-nav">
                <SelectableList valueLink={{
                    value: location.pathname,
                    requestChange: onRequestChangeList
                }}>
                    <ListItem primaryText="Live" value="/"/>
                    <ListItem primaryText="SHT" value="/sht"/>
                    <ListItem primaryText="IMU" value="/imu"/>
                    <ListItem primaryText="Map" value="/map"/>
                    <ListItem primaryText="GPS" value="/gps"/>
                    <ListItem primaryText="Planetary Data" value="/planet"/>
                    <ListItem primaryText="Video" value="/video"/>
                </SelectableList>
            </LeftNav>
        )
    }
});

const App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    propTypes: {
        location: React.PropTypes.object.isRequired
    },

    styles: {
        appBar: {
            position: 'fixed',
            top: 0
        }
    },

    handleRequestChangeList(e, value) {
        this.context.router.push(value);
    },

    render() {
        const styles = this.styles;

        return (
            <div>
                <AppBar title="KrakSat 2016" showMenuIconButton={false} style={styles.appBar} />
                <AppLeftNav open={true} location={this.props.location}
                            onRequestChangeList={this.handleRequestChangeList}/>
                <div id="app-main-container">
                    <section id="app-main-content">
                        <ReactCSSTransitionGroup
                            component="div"
                            className="content"
                            transitionName="main-content"
                            transitionEnterTimeout={1000}
                            transitionLeaveTimeout={500}>
                            {React.cloneElement(this.props.children, {
                                key: this.props.location.pathname
                            })}
                        </ReactCSSTransitionGroup>
                    </section>
                </div>
            </div>
        );
    }
});

const NoMatch = () => {
    return (
        <div>
            <h1>Not found</h1>
            <p>Requested URL is invalid</p>
        </div>
    )
};

export { App, NoMatch };
