import $ from 'jquery';

/**
 * Called with single object of retrieved data, intended to parse it and return it in a form that
 *  is later cached and passed to pointsProcessed.
 * @callback RequestHelper~processPoint
 * @param {object} point single object of data retrieved by AJAX request
 * @returns {object} object of dataName => value mapping to add to cache and process further by
 *  {@link RequestHelper~pointsProcessed}
 */
/**
 * Called after all data retrieved from a single request are processed
 * @callback RequestHelper~pointsProcessed
 * @param {object} newPoints map of arrays that contain data returned by
 *  {@link RequestHelper~processPoint}
 */
/**
 * Class that aims to simplify refreshing live chart/map/whatever data as well as caching it
 * between subpage changes.
 */
class RequestHelper {
    /**
     * @constructor
     * @param {string} url API URL to retrieve the data from
     * @param {number} interval time between requests
     * @param {Array} dataNames list of data names
     * @param {RequestHelper~processPoint} processPoint function to call that parses singe object
     *  of retrieved data
     */
    constructor(url, interval, dataNames, processPoint) {
        this.url = config.serverUrl + url;
        this.interval = interval;
        this.dataNames = dataNames;
        this.processPoint = processPoint;

        this.data = {};
        for (let name of dataNames) {
            this.data[name] = [];
        }
        this.lastTimestamp = '';
    }

    /**
     * Starts to make requests and process them.
     *
     * Note that you have to set {@link RequestHelper~pointsProcessed} in order to call this
     * function.
     *
     * @see {@link stop()}
     */
    start() {
        let self = this;
        this.request = $.get(this.url + '?start_timestamp=' + this.lastTimestamp,
            function (result) {
                if (result.length > 0) {
                    self.lastTimestamp = result[result.length - 1].timestamp;

                    let newPoints = {};
                    for (let name of self.dataNames) {
                        newPoints[name] = [];
                    }
                    for (let point of result) {
                        let p = self.processPoint(point);
                        for (let key in p) {
                            if (p.hasOwnProperty(key)) {
                                newPoints[key].push(p[key]);
                                self.data[key].push(p[key]);
                            }
                        }
                    }

                    self.pointsProcessed(newPoints);
                }
                self.timeout = setTimeout(() => self.start(), self.interval);
            });
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

export default RequestHelper;
