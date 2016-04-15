import React from 'react'
import { connect } from 'react-redux'
import { loadInvoices, changePage, toggleSortingAndLoadInvoices, changeSearchAndLoadInvoices } from '../actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import Table from './Table'

import PagingPanel from './PagingPanel'
import StatPanel from './StatPanel'
import InvoiceSearchPanel from './InvoiceSearchPanel'

const getCols = sort_method => [
    {
        key: 'iid',
        label: 'ID',
        format: x=><Link to={`/invoices/${x.iid}`}>{x.iid}</Link>,
        sorting: sort_method('iid')
    },
    {key: 'kind',     label: 'Kind',         sorting: sort_method('kind')},
    {key: 'date',     label: 'Invoice date', sorting: sort_method('date')},
    {key: 'place',    label: 'Place',        sorting: sort_method('place')},
    {key: 'subject',  label: 'Subject',      sorting: sort_method('subject')},
    {key: 'desc',     label: 'Description',  sorting: sort_method('description')},
    //{key: 'customer', label: 'Customer',     sorting: sort_method('customer')}
    //{key: 'products', label: 'Products',     sorting: sort_method('products')}
]

const InvoicePanel = (props) => {
    const { rows, count, page, sorting, search } = props.invoices;
    const { loadInvoices, changePage, toggleSortingAndLoadInvoices, changeSearchAndLoadInvoices  } = props;

    const onSearchChanged = query => changeSearchAndLoadInvoices(query)
    const sort_method = key => () => toggleSortingAndLoadInvoices(key)
    const cols = getCols(sort_method)

    return <div>
      <StatPanel />
      <div className="row">
        <div className="twelve columns">
          <h3>Invoice list</h3>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <Link className='button button-primary'
                style={{fontSize:'1em'}}
                to="/invoices/create">Create new invoice</Link>
          <InvoiceSearchPanel search={search} onSearchChanged={onSearchChanged} />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <Table sorting={sorting} cols={cols} rows={rows} />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <PagingPanel count={count+1} page={page+1} onNextPage={() => {
              changePage(page+1);
              loadInvoices()
          }} onPreviousPage={ () => {
              changePage(page-1);
              loadInvoices()
          }} />
        </div>
      </div>
    </div>
}


const mapStateToProps = state => ({
  invoices:state.invoices,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  loadInvoices, changePage, toggleSortingAndLoadInvoices, changeSearchAndLoadInvoices
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InvoicePanel);
