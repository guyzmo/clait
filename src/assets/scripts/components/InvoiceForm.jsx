import React from 'react';

import {
  loadInvoice,
  addInvoiceResult,
  updateInvoiceResult,
  deleteInvoiceResult,
} from '../actions/invoices';
import {
  showSuccessNotification,
  showErrorNotification,
} from '../actions/notifications';
import {
  submittingChanged
} from '../actions/ui';
import { reduxForm } from 'redux-form';
import { routeActions } from 'react-router-redux';
import DatePicker from './DatePicker';
import Input from './Input';
import Select from './Select';
//import ProductListForm from './ProductListForm';
import { danger, success } from '../util/colors';

const submit = (id, values, dispatch) => {
    let url = '//127.0.0.1:5000/invoices/'
    let type = 'POST'

    if(id) {
        url = `//127.0.0.1:5000/invoices/${id}`
        type = 'PUT'
    }

    dispatch(submittingChanged(true))

    $.ajax({
        type,
        url,
        data: values,
        success: (d) => {
            dispatch(submittingChanged(false))
            dispatch(showSuccessNotification('Success!'))
            if(id) {
                dispatch(updateInvoiceResult(d))
            } else {
                dispatch(addInvoiceResult(d))
            }
            dispatch(routeActions.push('/'));

        },
        error: (d) => {
            dispatch(submittingChanged(false))
            console.log(d);
            dispatch(showErrorNotification(`Error (${d.status} - ${d.statusText}) while saving: ${d.responseText}` ))
        }
    });
};

const del = (id, dispatch) => {
    const url = `//127.0.0.1:5000/invoices/${id}/`
    const type='DELETE';
    $.ajax({
        type,
        url,
        success: (d) => {

            dispatch(showSuccessNotification('Success!'))
            dispatch(deleteInvoiceResult(id))
            dispatch(routeActions.push('/'));

        },
        error: (d) => {
            dispatch(showErrorNotification(`Error (${d.status} - ${d.statusText}) while saving: ${d.responseText}` ))
        }
    });
};

const validate = values => {
    const errors = {};
    if (!values.date) {
        errors.date = 'Required';
    }
    if (!values.subject) {
        errors.subject = 'Required';
    }
    if (!values.kind) {
        errors.kind = 'Required';
    }
    if (!values.place) {
        errors.place = 'Required';
    }
    if (!values.customer.name) {
        errors.customer = 'Required';
    }
    if(values.date) {
        const re = /^\d{4}-\d{2}-\d{2}$/;
        if(!re.exec(values.publish_date)) {
            errors.publish_date = 'Invalid';
        }
    }
    return errors;
}



////////////////////////////////////////////////////////////////////////////

const total_value = (list) => list.reduce((acc, p) => (parseInt(p.qty.value||0)*parseFloat(p.price.value||0))+acc, 0)

const productsForm = (product_list) => product_list.map((product, index) =>
    <div className='row'>
      <div className='two columns'>
        <input type='text' className="u-full-width" {...product.price} />
      </div>
      <div className='two columns'>
        <input type='text' className="u-full-width" {...product.qty} />
      </div>
      <div className='three columns'>
        <input type='text' className="u-full-width" {...product.descr} />
      </div>
      <div className='five columns'>
          <div>
            <button type="button"
                    disabled={index === 0}
                    style={{fontSize:'1em'}}
                    onClick={() => {
                      product_list.swapFields(index, index - 1)  // swap field with it's predecessor
                    }}>▲
            </button>
            <button type="button"
                    disabled={index === product_list.length - 1}
                    style={{fontSize:'1em'}}
                    onClick={() => {
                      product_list.swapFields(index, index + 1)  // swap field with it's successor
                    }}>▼
            </button>
            <button className='button'
                    style={{fontSize:'1em', backgroundColor: danger}}
                    onClick={() => {
                      product_list.removeField(index)
                    }}>🚮
            </button>
          </div>
      </div>
    </div>
  )

const ProductListForm = (product_list) => <div>
        <label>
        Products
        </label>
        <div className='row'>
          <div className='two columns'>
            <label>Price</label>
          </div>
          <div className='two columns'>
            <label>Quantity</label>
          </div>
          <div className='five columns'>
            <label>Description</label>
          </div>
        </div>
        {productsForm(product_list)}
        <div className='row'>
            <button className='button'
                    style={{fontSize:'1em', backgroundColor: success}}
                    onClick={() => {
                      product_list.addField({ price: '0', qty: '1', descr: ''})}
                    }>
              <i/>+
            </button>
        </div>
        <div className='row'>
          <div className='one-half columns'>
            <label>Total</label>
            <input type="text" disabled value={total_value(product_list)} />
          </div>
        </div>
      </div>

////////////////////////////////////////////////////////////////////////////

class InvoiceForm extends React.Component {

    render() {
        const {fields:
            {
                iid,
                kind,
                date,
                place,
                subject,
                desc,
                customer,
                products
            }, handleSubmit, dispatch } = this.props;
        const { id } = this.props.params;
        const { isSubmitting } = this.props.ui;
        console.log('<InvoiceForm>:', this.props)

        const tsubmit = submit.bind(undefined,id);
        const dsubmit = del.bind(undefined,id, dispatch);

        return <form onSubmit={handleSubmit(tsubmit)}>
            <div className='row'>
                <div className='three columns'>
                    <DatePicker className="u-full-width" label='Invoice Date' field={date} />
                </div>
                <div className='three columns'>
                    <Input label='kind' field={kind} />
                </div>
                <div className='four columns'>
                    <Input label='place' field={place} />
                </div>
            </div>
            <div className='row'>
                <div className='ten columns'>
                    <Input label='subject' field={subject} />
                </div>
            </div>
            <div className='row'>
                <div className='ten columns'>
                    <textarea placeholder="Description" {...desc}/>
                </div>
            </div>
            <div className='row'>
                <div className='ten columns'>
                    <Input label='Customer name' field={customer.name} />
                </div>
            </div>
            <div className='row'>
                <div className='ten columns'>
                  <label>Customer Address</label>
                  { [0, 1, 2].map(idx => <input type='text' className="u-full-width" {...customer.address[idx]} />) }
                </div>
            </div>
            <div className='row'>

              {ProductListForm(products)}

            </div>
            <button disabled={isSubmitting} className='button button-primary' onClick={handleSubmit(tsubmit)}>
                Save
            </button>
            {id?<button disabled={isSubmitting || id==='create'} type='button' className='button button-primary' style={{backgroundColor: danger}} onClick={dsubmit}>
                Delete
            </button>:null}
        </form>
    }

    componentDidMount() {
        // if(this.props.categories.categories.length==0) {
        //     this.props.dispatch(loadCategories());
        // }

        if (this.props.params.id) {
            if(!this.props.invoice || this.props.invoice.id != this.props.params.id) {
                this.props.dispatch(loadInvoice(this.props.params.id));
            }
        } else {
            // New invoice
        }
    }
};


const mapStateToProps = (state, props) => {
    console.log('calling MSTP on invoiceform', state, props);
    let initial = {}
    const { invoice } = state.invoices

    if(props.params.id && invoice) {
        initial = invoice
    }

    return {
        invoice: state.invoices.invoice,
        ui: state.ui,
        initialValues: initial,
    }
};

export default reduxForm({
    form: 'invoiceForm',
    fields: [
      'iid',
      'kind',
      'date',
      'place',
      'subject',
      'desc',
      'customer.name',
      'customer.address[]',
      'products[].price',
      'products[].qty',
      'products[].descr' ],
    validate
}, mapStateToProps)(InvoiceForm);
