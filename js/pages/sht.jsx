import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import RequestHelper from 'app/requesthelper';

let requestHelper = new RequestHelper('/sht/', 1000, ['temperature', 'humidity'],
    function (point) {
        let time = (new Date(point.timestamp)).getTime();
        return {
            temperature: [time, parseFloat(point.temperature)],
            humidity: [time, parseFloat(point.humidity)]
        };
    });

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
        requestHelper.pointsProcessed = function (newPoints) {
            addPointsToChart(temperatureChart, newPoints['temperature']);
            addPointsToChart(humidityChart, newPoints['humidity']);
        };
        requestHelper.start();
    },

    componentWillUnmount() {
        requestHelper.stop();
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
