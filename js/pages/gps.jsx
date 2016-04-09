import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

import { PointRequestHelper } from 'app/requesthelper';
import {chartRangeSelectorConfig, addPointsToChart} from 'app/charts';

let requestHelper = new PointRequestHelper('/gps/', config.refreshRates.gps, ['altitude', 'speed',
        'activeSatellites'],
    function (point) {
        let time = (new Date(point.timestamp)).getTime();
        return {
            altitude: [time, point.altitude],
            speed: [time, point.speed_over_ground],
            activeSatellites: [time, point.active_satellites]
        };
    });

const AltitudeChart = React.createClass({
    render() {
        var config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Altitude'},
            yAxis: {
                labels: {
                    format: '{value} m'
                }
            },
            series: [{
                name: 'Altitude',
                data: requestHelper.data['altitude'].slice(),
                type: 'spline',
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: 'm'
                }
            }]
        };

        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const SpeedChart = React.createClass({
    render() {
        var config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Speed over ground'},
            yAxis: {
                labels: {
                    format: '{value} km/h'
                }
            },
            series: [{
                name: 'Speed',
                data: requestHelper.data['speed'].slice(),
                type: 'spline',
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: 'km/h'
                }
            }]
        };

        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const SatellitesChart = React.createClass({
    render() {
        var config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Satellites'},
            series: [{
                name: 'Active satellites',
                data: requestHelper.data['activeSatellites'].slice(),
                step: true
            }]
        };

        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const GPS = React.createClass({
    componentDidMount() {
        let altitudeChart = this.refs.altitudeChart,
            speedChart = this.refs.speedChart,
            satellitesChart = this.refs.satellitesChart;
        requestHelper.start(newPoints => {
            addPointsToChart(altitudeChart, newPoints['altitude']);
            addPointsToChart(speedChart, newPoints['speed']);
            addPointsToChart(satellitesChart, newPoints['activeSatellites']);
        });
    },

    componentWillUnmount() {
        requestHelper.stop();
    },

    render() {
        return (
            <div>
                <h1>GPS</h1>
                <AltitudeChart ref="altitudeChart"/>
                <SpeedChart ref="speedChart"/>
                <SatellitesChart ref="satellitesChart"/>
            </div>
        );
    }
});

export default GPS;
