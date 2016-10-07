import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, IndexRedirect, Link } from 'react-router';
import { Provider } from 'react-redux';

import 'jquery';
import 'jquery-ui';

import { store, history, DevTools } from './store'

import InvoiceApp from './components/InvoiceApp';
import InvoicePanel from './components/InvoicePanel';
import InvoiceForm from './components/InvoiceForm';
import StatPanel from './components/StatPanel';

const About = () => {
    return <div>
        <h2>About</h2>
        <Link to="/">Home</Link>
    </div>
}

const NoMatch = () => {
    return <div>
        <h2>Path not found.</h2>
        Your URL must be wrong, please head back to <Link to="/">Home</Link>!
    </div>
}

const Dashboard = () => {
    return <div>
      <h2>Dashboard</h2>
      <StatPanel />
      <div><i>Work in Progress…</i></div>
      <Link to="/">Get back home…</Link>
    </div>
}

ReactDOM.render((
    <Provider store={store}>
      <div>
        <Router history={history}>
          <Route name="Invoices" path="/" component={InvoiceApp}>
            <IndexRedirect to="/invoices" />
            <Route name="List" path="/invoices" component={InvoicePanel} />
            <Route path="/invoices/:id" component={InvoiceForm} />

            <Route name="Dashboard" path="/dashboard" component={Dashboard}/>
            <Route name="About" path="/about" component={About}/>
            <Route name="404: Page not found" path="*" component={NoMatch}/>
          </Route>
        </Router>
      </div>
    </Provider>
    ), document.getElementById('content'))

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

