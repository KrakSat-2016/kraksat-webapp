import $ from 'jquery';

/**
 * Class that aims to simplify refreshing live chart/map/whatever data as well as caching it
 * between subpage changes.
 */
class RequestHelper {
    /**
     * @constructor
     * @param {string} url API URL to retrieve the data from
     * @param {number} interval time between requests
     */
    constructor(url, interval) {
        this.url = config.serverUrl + url;
        this.interval = interval;
        this.data = {};
    }

    /**
     * Called after data from a request are retrieved
     * @callback RequestHelper~resultCallback
     * @param {object} retrieved data
     */
    /**
     * Starts to make requests and process them.
     *
     * @param {RequestHelper~resultCallback} resultCallback function to be called with retrieved
     *  data
     *
     * @see {@link stop()}
     */
    start(resultCallback) {
        this.request = $.get(this.url, function (result) {
            this.data = result;
            resultCallback(result);
            this.timeout = setTimeout(() => this.start(resultCallback), this.interval);
        }.bind(this));
    }

    /**
     * Aborts current request or timer.
     *
     * @see {@link start()}
     */
    stop() {
        if (typeof this.request !== 'undefined') {
            this.request.abort();
        }
        if (typeof this.timeout !== 'undefined') {
            clearTimeout(this.timeout);
        }
    }
}

/**
 * Called with single object of retrieved data, intended to parse it and return it in a form that
 *  is later cached and passed to pointsProcessed.
 * @callback PointRequestHelper~processPoint
 * @param {object} point single object of data retrieved by AJAX request
 * @returns {object} object of dataName => value mapping to add to cache and process further by
 *  {@link PointRequestHelper~pointsProcessed}
 */
/**
 * RequestHelper subclass that is made specifically for charts and other data that consist of
 * points added over time.
 */
class PointRequestHelper extends RequestHelper {
    /**
     * @constructor
     * @param {string} url API URL to retrieve the data from
     * @param {number} interval time between requests
     * @param {Array} dataNames list of data names
     * @param {PointRequestHelper~processPoint} processPoint function to call that parses single
     *  object of retrieved data
     */
    constructor(url, interval, dataNames, processPoint) {
        super(url, interval);
        this.dataNames = dataNames;
        this.processPoint = processPoint;

        this.data = {};
        for (let name of dataNames) {
            this.data[name] = [];
        }
        this.lastTimestamp = '';
    }

    /**
     * Called after all data retrieved from a single request are processed
     * @callback PointRequestHelper~pointsProcessed
     * @param {object} newPoints map of arrays that contain data returned by
     *  {@link PointRequestHelper~processPoint}
     */
    /**
     * Starts to make requests and process them.
     *
     * @param {PointRequestHelper~pointsProcessed} pointsProcessedCallback function to be called
     *  with new added points
     *
     * @see {@link stop()}
     */
    start(pointsProcessedCallback) {
        this.request = $.get(this.url + '?start_timestamp=' + this.lastTimestamp,
            function (result) {
                if (result.length > 0) {
                    this.lastTimestamp = result[result.length - 1].timestamp;

                    let newPoints = {};
                    for (let name of this.dataNames) {
                        newPoints[name] = [];
                    }
                    for (let point of result) {
                        let p = this.processPoint(point);
                        for (let key in p) {
                            if (p.hasOwnProperty(key)) {
                                newPoints[key].push(p[key]);
                                this.data[key].push(p[key]);
                            }
                        }
                    }

                    pointsProcessedCallback(newPoints);
                }
                this.timeout =
                    setTimeout(() => this.start(pointsProcessedCallback), this.interval);
            }.bind(this));
    }
}

export { RequestHelper, PointRequestHelper };
