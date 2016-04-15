import React from 'react';

import { connect } from 'react-redux'


class StatePanel extends React.Component {
  render() {
    const {
      invoice_total,
      monthly_revenue,
      yearly_revenue,
      monthly_results,
      quaterly_results,
      yearly_results
    } = this.props;
    return (
    <div>
      <div className="row">
        <div className="one-half column">
          Yearly results: €1000 in 2016, €2000 in 2015, €500 in 2014
        </div>
      </div>
      <div className="row">
        <div className="one-half column">
          Quaterly results: €350 in Q1, €200 in Q4, €200 in Q3
        </div>
      </div>
      <div className="row">
        <div className="one-half column">
          Monthly results: €100 in Jan, €200 in Feb, €50 in March
        </div>
      </div>
      <div className="row">
        <div className="one-half column">
          Number of invoices: {invoice_total} <br/>
          Monthly Revenue: {monthly_revenue} <br/>
          Yearly Revenue: {yearly_revenue}
        </div>
      </div>
    </div>)
  }

  componentDidMount() {
  }
}

const mapStateToProps = (state) => ({
  invoice_total:    '42',
  monthly_revenue:  '1100',
  yearly_revenue:   '12320',
  yearly_results:   {'2016': '1000', '2015': '2000', '2014': '500'},
  quaterly_results: {'2016Q1': '350', '2015Q4': '200', '2015Q3': '200'},
  monthly_results:  {'50': 'Mar', 'Feb': '200', 'Jan': '100'}
});

export default connect(mapStateToProps)(StatePanel)
