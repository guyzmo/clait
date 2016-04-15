/*
import React from 'react';
import {connect} from 'react-redux';

import Input from './Input';
import { danger } from '../util/colors';

import { addProductToInvoiceForm, delProductFromInvoiceForm } from '../actions'

class ProductListForm extends React.Component {
  render() {
    console.log('<ProductListForm>:', this.props);
    const { products, line, dispatch } = this.props;
    let removeLine = (e) => {
      dispatch(delProductFromInvoiceForm(products, products.indexOf(parseInt(e.target.id))))
      e.stopPropagation()
    }
    let appendLine = (e) => {
      //dispatch(addProductToInvoiceForm(products, { price: '', qty: '', descr: ''}))
      products.addField({ price: '', qty: '', descr: ''});
      e.stopPropagation();
    }
    const total_value = Number(products.reduce((acc, p) => (parseInt(p.qty.value||0)*parseInt(p.price.value||0))+acc, 0))
    const productsForm = products.map(product =>
        console.log('   productlistform', product.price, product.qty, product.descr) ||
        <div className='row'>
          <div className='two columns'>
            <input type='text' className="u-full-width" value={product.price} />
          </div>
          <div className='two columns'>
            <input type='text' className="u-full-width" value={product.qty} />
          </div>
          <div className='five columns'>
            <input type='text' className="u-full-width" value={product.descr} />
          </div>
          <div className='three columns'>
              {products.length > 1 &&
                <button className='button button-primary'
                      style={{fontSize:'1em', backgroundColor: danger}}
                      id={products.indexOf(product)}
                      onClick={removeLine}>-</button>
              }
              {products.length == products.indexOf(product)+1 &&
                <button className='button button-primary'
                      style={{fontSize:'1em'}}
                      onClick={appendLine}>+</button>
              }
          </div>
        </div>
      )
    return <div>
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
            {productsForm}
            {products.length == 0 &&
                <button className='button button-primary'
                      style={{fontSize:'1em'}}
                      onClick={appendLine}>+</button>
            }
            <div className='row'>
              <div className='one-half columns'>
                <label>Total</label>
                <input type="text" disabled
                value={total_value} />
              </div>
            </div>
           </div>


  }
}

const mapStateToProps = (state, props) => {
    console.log('calling MSTP on productlistform', state, props);
    return {
        products: state.product_list.products,
        line: state.product_list.line,
        ui: state.ui,
        initialValues: state.invoices.products,
    }
}

export default connect(mapStateToProps)(ProductListForm)
*/
