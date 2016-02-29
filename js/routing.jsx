import React from 'react';
import { Router, Route, IndexRoute } from 'react-router'

import { App, NoMatch } from './app'
import Telemetry from './pages/telemetry';
import SHT from './pages/sht';

const AppRoutes = (
    <Route path="/" component={App}>
        <IndexRoute component={Telemetry}/>
        <Route path="sht" component={SHT}/>
        <Route path="*" component={NoMatch}/>
    </Route>
);

export default AppRoutes;
