import React from 'react';
import { Router, Route, IndexRoute } from 'react-router'

import { App, NoMatch } from './app'
import Live from './pages/live';
import SHT from './pages/sht';
import IMU from './pages/imu';
import Map from './pages/map';
import GPS from './pages/gps';
import PlanetaryData from './pages/planetarydata';
import Video from './pages/video';

const AppRoutes = (
    <Route path="/" component={App}>
        <IndexRoute component={Live}/>
        <Route path="sht" component={SHT}/>
        <Route path="imu" component={IMU}/>
        <Route path="map" component={Map}/>
        <Route path="gps" component={GPS}/>
        <Route path="planet" component={PlanetaryData}/>
        <Route path="video" component={Video}/>
        <Route path="*" component={NoMatch}/>
    </Route>
);

export default AppRoutes;
