/**
 * Default range selector config for charts. Adds 1, 2, 3, 5min buttons.
 * @type object
 */
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

/**
 * Add given list of points to provided chart serie.
 * @param {ReactHighstock} chartComponent ReactHighstock component object
 * @param {Array} points array of points to add
 * @param {number} serieIndex index of serie to add the points to
 */
let addPointsToChart = function (chartComponent, points, serieIndex) {
    if (typeof serieIndex === 'undefined') {
        serieIndex = 0;
    }
    let chart = chartComponent.refs.chart.getChart();
    let serie = chart.series[serieIndex];
    for (let point of points) {
        serie.addPoint(point, false);
    }
    chart.redraw();
};

export {chartRangeSelectorConfig, addPointsToChart};
