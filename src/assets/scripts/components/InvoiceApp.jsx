import React from 'react'

import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { loadInvoices } from '../actions/invoices'

import NotificationContainer from './notification';
import LoadingContainer from './loading';
import StatPanel from './StatPanel'

class App extends React.Component {

    render() {
        const { isLoading } = this.props.ui;
        return <div>
            {this.props.children}

            <NotificationContainer />
            <LoadingContainer isLoading={isLoading} />

        </div>
    }

    componentDidMount() {
        let { loadInvoices } = this.props;

        if(this.props.invoices.rows.length==0) {
            loadInvoices();
        }
    }
}

const mapStateToProps = state => ({
    invoices:state.invoices,
  ui:state.ui,
})


const mapDispatchToProps = dispatch => bindActionCreators({
    loadInvoices
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(App);
