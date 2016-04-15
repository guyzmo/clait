import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHashHistory } from 'history'

import * as reducers from './reducers'

import thunk from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers, compose  } from 'redux'
import { reducer as formReducer } from 'redux-form';
import createHistory from 'history/lib/createHashHistory'

// Opt-out of persistent state, not recommended.
// http://rackt.org/history/stable/HashHistoryCaveats.html
const browserHistory = useRouterHistory(createHashHistory)({ queryKey: false })

// const combineReducers2 = o => {
//     return (state={}, action) => {
//         const mapped = Object.keys(o).map(k => (
//             {
//                 key: k,
//                 slice: o[k](state[k], action)
//             }
//         ))

//         const reduced = mapped.reduce((s, x)=>{
//             s[x['key']]=x['slice']
//             return s
//         }, {})

//         return reduced;
//     }
// }

// const combineReducers3 = o => (state={}, action) => Object.keys(o).map(k => [
//     k, o[k](state[k], action)
// ]).reduce((s, x) => Object.assign(s, {
//     [x[0]]: x[1]
// }), {})


//const reducer = combineReducers3(Object.assign({}, {
const reducer = combineReducers(Object.assign({}, {
    ...reducers,
      routing: routerReducer,
      form: formReducer
}));

import React from 'react';
//import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import ChartMonitor from 'redux-devtools-chart-monitor';
import DockMonitor from 'redux-devtools-dock-monitor'

// const DevTools = createDevTools(
//   <DockMonitor toggleVisibilityKey='ctrl-h'
//               changePositionKey='ctrl-q'
//               changeMonitorKey='ctrl-m'
//               defaultPosition='bottom'
//               defaultSize={0.15}>
//     <LogMonitor theme="tomorrow" preserveScrollTop={false} />
//   </DockMonitor>
// )

const logStateMiddleware = ({dispatch, getState}) => next => action => {
    console.log(action.type, getState())
    next(action)
}

const store = createStore(
  reducer,
  // compose(
  //   applyMiddleware(thunk),
  //   DevTools.instrument()
  // )
  applyMiddleware(thunk)
);

const history = syncHistoryWithStore(browserHistory, store)

export { store, history/*, DevTools*/ };
