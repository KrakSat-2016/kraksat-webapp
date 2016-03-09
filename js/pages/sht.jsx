import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

import { PointRequestHelper } from 'app/requesthelper';
import {chartRangeSelectorConfig, addPointsToChart} from 'app/charts';

let requestHelper = new PointRequestHelper('/sht/', 1000, ['temperature', 'humidity'],
    function (point) {
        let time = (new Date(point.timestamp)).getTime();
        return {
            temperature: [time, parseFloat(point.temperature)],
            humidity: [time, parseFloat(point.humidity)]
        };
    });

const TemperatureChart = React.createClass({
    render() {
        var config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Temperature'},
            series: [{
                name: 'Temperature',
                data: requestHelper.data['temperature'].slice(),
                type: 'spline',
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '℃'
                }
            }]
        };

        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const HumidityChart = React.createClass({
    render() {
        var config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Humidity'},
            series: [{
                name: 'Humidity',
                data: requestHelper.data['humidity'].slice(),
                type: 'spline',
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '%'
                }
            }]
        };

        return (
            <ReactHighstock config={config} ref="chart"/>
        );
    }
});

const SHT = React.createClass({
    componentDidMount() {
        let temperatureChart = this.refs.temperatureChart,
            humidityChart = this.refs.humidityChart;
        requestHelper.start(newPoints => {
            addPointsToChart(temperatureChart, newPoints['temperature']);
            addPointsToChart(humidityChart, newPoints['humidity']);
        });
    },

    componentWillUnmount() {
        requestHelper.stop();
    },

    render() {
        return (
            <div>
                <h1>SHT</h1>
                <TemperatureChart ref="temperatureChart"/>
                <HumidityChart ref="humidityChart"/>
            </div>
        );
    }
});

export default SHT;
