import React from 'react';

import {RequestHelper} from 'app/requesthelper';
import {CardContainer, Card} from 'app/cards';

let telemetryRequestHelper = new RequestHelper('/telemetry/?latest=1', config.refreshRates.sht);
let gpsRequestHelper = new RequestHelper('/gps/?latest=1', config.refreshRates.gps);
let requestHelpers = [telemetryRequestHelper, gpsRequestHelper];


const Live = React.createClass({
    getInitialState() {
        return {
            'temperature': '', 'humidity': '', 'pressure': '', 'gyro_x': '', 'gyro_y': '',
            'gyro_z': '', 'accel_x': '', 'accel_y': '', 'accel_z': '', 'magnet_x': '',
            'magnet_y': '', 'magnet_z': '', 'latitude': '', 'longitude': '', 'altitude': '',
            'speed_over_ground': '', 'active_satellites': ''
        }
    },

    componentDidMount() {
        for (let requestHelper of requestHelpers) {
            this.setState(requestHelper.data);
            requestHelper.start(function (result) {
                this.setState(result);
            }.bind(this));
        }
    },

    componentWillUnmount() {
        for (let requestHelper of requestHelpers) {
            requestHelper.stop();
        }
    },

    render() {
        return (
            <div>
                <h1>Live</h1>
                <h2>SHT</h2>
                <CardContainer>
                    <Card propertyName="Temperature" value={this.state.temperature} unit="℃"/>
                    <Card propertyName="Humidity" value={this.state.humidity} unit="%" noUnitSpace={true}/>
                    <Card propertyName="Pressure" value={this.state.pressure} unit="hPa"/>
                </CardContainer>
                <h2>IMU</h2>
                <CardContainer>
                    <Card propertyName="Angular velocity (X)" value={this.state.gyro_x} unit="dps"/>
                    <Card propertyName="Angular velocity (Y)" value={this.state.gyro_y} unit="dps"/>
                    <Card propertyName="Angular velocity (Z)" value={this.state.gyro_z} unit="dps"/>

                    <Card propertyName="Linear acceleraton (X)"
                          value={this.state.accel_x} unit="g"/>
                    <Card propertyName="Linear acceleraton (Y)"
                          value={this.state.accel_y} unit="g"/>
                    <Card propertyName="Linear acceleraton (Z)"
                          value={this.state.accel_z} unit="g"/>

                    <Card propertyName="Magnetic field (X)"
                          value={this.state.magnet_x} unit="gauss"/>
                    <Card propertyName="Magnetic field (Y)"
                          value={this.state.magnet_y} unit="gauss"/>
                    <Card propertyName="Magnetic field (Z)"
                          value={this.state.magnet_z} unit="gauss"/>
                </CardContainer>
                <h2>GPS</h2>
                <CardContainer>
                    <Card propertyName="Latitude"
                          value={this.state.latitude} unit="°" noUnitSpace={true}/>
                    <Card propertyName="Longitude"
                          value={this.state.longitude} unit="°" noUnitSpace={true}/>
                    <Card propertyName="Altitude"
                          value={this.state.altitude} unit="m"/>
                    <Card propertyName="Speed over ground"
                          value={this.state.speed_over_ground} unit="km/h"/>
                    <Card propertyName="Active satellites" value={this.state.active_satellites}/>
                </CardContainer>
            </div>
        )
    }
});

export default Live;
