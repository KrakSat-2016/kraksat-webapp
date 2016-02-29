import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory, Route, IndexRoute, Link, hashHistory } from 'react-router';
import { createHashHistory } from 'history';

// React < 1.0: https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import AppRoutes from './routing'

render((
    <Router history={useRouterHistory(createHashHistory)({queryKey: false})}>
        {AppRoutes}
    </Router>
), document.getElementById('main'));
