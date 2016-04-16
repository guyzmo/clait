import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHashHistory } from 'history'

import invoices from './reducers/invoices';
import notifications from './reducers/notifications';
import ui from './reducers/ui';

import thunk from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers, compose  } from 'redux'
import { reducer as formReducer } from 'redux-form';
import createHistory from 'history/lib/createHashHistory'

// Opt-out of persistent state, not recommended.
// http://rackt.org/history/stable/HashHistoryCaveats.html
const browserHistory = useRouterHistory(createHashHistory)({ queryKey: false })

const reducer = combineReducers(Object.assign({}, {
      invoices, ui,
      notification: notifications,
      routing: routerReducer,
      form: formReducer
}));

const logStateMiddleware = ({dispatch, getState}) => next => action => {
    console.log(action.type, getState())
    next(action)
}

/* devtools support */
// import LogMonitor from 'redux-devtools-log-monitor';
// import SliderMonitor from 'redux-slider-monitor';
// import ChartMonitor from 'redux-devtools-chart-monitor';
// import DockMonitor from 'redux-devtools-dock-monitor'
// import { createDevTools } from 'redux-devtools';
//
// const DevTools = createDevTools(
//   <DockMonitor toggleVisibilityKey='ctrl-h'
//               changePositionKey='ctrl-q'
//               changeMonitorKey='ctrl-m'
//               defaultPosition='bottom'
//               defaultSize={0.15}>
//     <LogMonitor theme="tomorrow" preserveScrollTop={false} />
//   </DockMonitor>
// )
//
// const store = createStore(
//   reducer,
//   compose(
//     applyMiddleware(thunk),
//     DevTools.instrument()
//   )
// );

const DevTools = {};

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

const history = syncHistoryWithStore(browserHistory, store)

export { store, history, DevTools };


