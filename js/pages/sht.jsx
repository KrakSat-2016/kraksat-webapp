import $ from 'jquery';
import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

let temperaturePoints = [],
    humidityPoints = [],
    lastTimestamp = '';

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

let setChartData = function(chartComponent, data) {
    let serie = chartComponent.refs.chart.getChart().series[0];
    serie.setData(data.slice());
};

const SHTCharts = React.createClass({
    componentDidMount() {
        let temperatureChart = this.refs.temperatureChart,
            humidityChart = this.refs.humidityChart;
        setChartData(temperatureChart, temperaturePoints);
        setChartData(humidityChart, humidityPoints);

        this.request = $.get(config.serverUrl + '/sht/?start_timestamp=' + lastTimestamp,
            function (result) {
                if (result.length == 0) {
                    return;
                }

                let newTemperaturePoints = [],
                    newHumidityPoints = [];

                for (let point of result) {
                    let time = (new Date(point.timestamp)).getTime();
                    let temperature = [time, parseFloat(point.temperature)],
                        humidity = [time, parseFloat(point.humidity)];

                    newTemperaturePoints.push(temperature);
                    temperaturePoints.push(temperature);
                    newHumidityPoints.push(humidity);
                    humidityPoints.push(humidity);
                }

                lastTimestamp = result[result.length - 1].timestamp;
                addPointsToChart(temperatureChart, newTemperaturePoints);
                addPointsToChart(humidityChart, newHumidityPoints);
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
