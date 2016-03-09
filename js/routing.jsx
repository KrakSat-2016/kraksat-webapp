import React from 'react';
import { Router, Route, IndexRoute } from 'react-router'

import { App, NoMatch } from './app'
import Telemetry from './pages/telemetry';
import SHT from './pages/sht';
import IMU from './pages/imu';
import Map from './pages/map';
import GPS from './pages/gps';
import PlanetaryData from './pages/planetarydata';

const AppRoutes = (
    <Route path="/" component={App}>
        <IndexRoute component={Telemetry}/>
        <Route path="sht" component={SHT}/>
        <Route path="imu" component={IMU}/>
        <Route path="map" component={Map}/>
        <Route path="gps" component={GPS}/>
        <Route path="planet" component={PlanetaryData}/>
        <Route path="*" component={NoMatch}/>
    </Route>
);

export default AppRoutes;
