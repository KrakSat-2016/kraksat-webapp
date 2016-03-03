import $ from 'jquery';
import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

let chartRangeSelectorConfig = {
    buttons: [
        {count: 1, type: 'minute', text: '1M'},
        {count: 2, type: 'minute', text: '2M'},
        {count: 3, type: 'minute', text: '3M'},
        {count: 5, type: 'minute', text: '5M'},
        {type: 'all', text: 'All'}
    ],
    inputEnabled: false,
    selected: 0
};

let addPointsToChart = function(chartComponent, points) {
    let chart = chartComponent.refs.chart.getChart();
    let serie = chart.series[0];
    for (let point of points) {
        serie.addPoint(point, false);
    }
    chart.redraw();
};

const SHTCharts = React.createClass({
    componentDidMount() {
        let temperatureChart = this.refs.temperatureChart,
            humidityChart = this.refs.humidityChart;

        this.request = $.get('http://127.0.0.1:8020/sht/', function(result) {
            let temperaturePoints = [],
                humidityPoints = [];

            for (let point of result) {
                let time = (new Date(point.timestamp)).getTime();
                temperaturePoints.push([time, parseFloat(point.temperature)]);
                humidityPoints.push([time, parseFloat(point.humidity)]);
            }

            addPointsToChart(temperatureChart, temperaturePoints);
            addPointsToChart(humidityChart, humidityPoints);
        });
    },

    componentWillUnmount() {
        if (typeof this.request !== 'undefined') {
            this.request.abort();
        }
    },

    render() {
        return (
            <div>
                <TemperatureChart ref="temperatureChart"/>
                <HumidityChart ref="humidityChart"/>
            </div>
        )
    }
});

const TemperatureChart = React.createClass({
    render() {
        var config = {
            rangeSelector: chartRangeSelectorConfig,
            title: {text: 'Temperature'},
            series: [{
                name: 'Temperature',
                data: [],
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
                data: [],
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
    render() {
        return (
            <div>
                <h1>SHT</h1>
                <SHTCharts/>
            </div>
        );
    }
});

export default SHT;
