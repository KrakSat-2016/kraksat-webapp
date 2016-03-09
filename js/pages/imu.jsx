import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

import { PointRequestHelper } from 'app/requesthelper';
import {chartRangeSelectorConfig, addPointsToChart} from 'app/charts';

let requestHelper = new PointRequestHelper('/imu/', 1000, ['pressure', 'gyroX', 'gyroY', 'gyroZ',
    'accelX', 'accelY', 'accelZ', 'magnetX', 'magnetY', 'magnetZ'],
    function (point) {
        let time = (new Date(point.timestamp)).getTime();
        return {
            pressure: [time, point.pressure],
            gyroX: [time, point.gyro_x],
            gyroY: [time, point.gyro_y],
            gyroZ: [time, point.gyro_z],
            accelX: [time, point.accel_x],
            accelY: [time, point.accel_y],
            accelZ: [time, point.accel_z],
            magnetX: [time, point.magnet_x],
            magnetY: [time, point.magnet_y],
            magnetZ: [time, point.magnet_z]
        };
    });

let generateSerie = function (dataName, axis, unit) {
    return {
        name: axis,
        data: requestHelper.data[dataName + axis].slice(),
        type: 'spline',
        tooltip: {
            valueDecimals: 5,
            valueSuffix: unit
        }
    };
};

let generateChartConfig = function (title, dataName, unit) {
    return {
        rangeSelector: chartRangeSelectorConfig,
        title: {text: title},
        series: [
            generateSerie(dataName, 'X', unit),
            generateSerie(dataName, 'Y', unit),
            generateSerie(dataName, 'Z', unit)
        ]
    };
};

const PressureChart = React.createClass({
    render() {
        let config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Pressure'},
            series: [{
                    name: 'Pressure',
                    data: requestHelper.data['pressure'].slice(),
                    type: 'spline',
                    tooltip: {
                        valueDecimals: 2,
                        valueSuffix: 'hPa'
                    }
            }]
        };
        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const GyroChart = React.createClass({
    render() {
        let config = generateChartConfig('Gyroscope', 'gyro', 'dps');
        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const AccelerometerChart = React.createClass({
    render() {
        let config = generateChartConfig('Accelerometer', 'accel', 'g');
        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const MagnetometerChart = React.createClass({
    render() {
        let config = generateChartConfig('Magnetometer', 'magnet', 'gauss');
        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const IMU = React.createClass({
    componentDidMount() {
        let pressureChart = this.refs.pressureChart,
            gyroChart = this.refs.gyroChart,
            accelerometerChart = this.refs.accelerometerChart,
            magnetometerChart = this.refs.magnetometerChart;

        requestHelper.start(newPoints => {
            addPointsToChart(pressureChart, newPoints['pressure'], 0);
            addPointsToChart(gyroChart, newPoints['gyroX'], 0);
            addPointsToChart(gyroChart, newPoints['gyroY'], 1);
            addPointsToChart(gyroChart, newPoints['gyroZ'], 2);
            addPointsToChart(accelerometerChart, newPoints['accelX'], 0);
            addPointsToChart(accelerometerChart, newPoints['accelY'], 1);
            addPointsToChart(accelerometerChart, newPoints['accelZ'], 2);
            addPointsToChart(magnetometerChart, newPoints['magnetX'], 0);
            addPointsToChart(magnetometerChart, newPoints['magnetY'], 1);
            addPointsToChart(magnetometerChart, newPoints['magnetZ'], 2);
        });
    },

    componentWillUnmount() {
        requestHelper.stop();
    },

    render() {
        return (
            <div>
                <h1>IMU</h1>
                <PressureChart ref="pressureChart"/>
                <GyroChart ref="gyroChart"/>
                <AccelerometerChart ref="accelerometerChart"/>
                <MagnetometerChart ref="magnetometerChart"/>
            </div>
        );
    }
});

export default IMU;
