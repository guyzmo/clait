import { history } from  '../store';
import { formatUrl } from '../util/formatters';
import { loadingChanged } from './ui';

export function showInvoicesResult(jsonResult) {
    console.log('showInvoicesResult(): jsonResult=', jsonResult);
    return {
        type: "SHOW_INVOICES",
        invoices: jsonResult
    };
}

export function showInvoiceResult(jsonResult) {
    console.log('showInvoiceResult(): jsonResult=', jsonResult);
    return {
        type: "SHOW_INVOICE",
        invoice: jsonResult
    };
}


export function addInvoiceResult(invoice) {
    console.log('addInvoiceResult(): invoice=', invoice);
    return {
        type: "ADD_INVOICE",
        invoice
    };
}

export function updateInvoiceResult(invoice) {
    console.log('updateInvoiceResult(): invoice=', invoice);
    return {
        type: "UPDATE_INVOICE",
        invoice
    };
}

export function deleteInvoiceResult(id) {
    console.log('deleteInvoiceResult(): id=', invoice);
    return {
        type: "DELETE_INVOICE",
        id
    };
}

export function changePage(page) {
    console.log('changePage():', page)
    return {
        type: "CHANGE_PAGE",
        page
    }
}

export function toggleSorting(sorting) {
    console.log('toggleSorting():', sorting)
    return {
        type: "TOGGLE_SORTING",
        sorting
    }
}

export function changeSearchAndLoadInvoices(search) {
    console.log('changeSearchAndLoadInvoices():', search )
   return (dispatch, getState) => {
        dispatch(changeSearch(search))
        history.push( {
            search: formatUrl(getState().invoices)
        } )
        dispatch(loadInvoices())
    }
}

export function changeSearch(search) {
    console.log('changeSearch():', search )
    return {
        type: 'CHANGE_SEARCH',
        search
    }
}

export function toggleSortingAndLoadInvoices(sorting) {
    console.log('toggleSortingAndLoadInvoices():', sorting )
    return (dispatch, getState) => {
        dispatch(toggleSorting(sorting))
        history.push( {
            search: formatUrl(getState().invoices)
        } )
        dispatch(loadInvoices())
    }
}


export function loadInvoices(page=0) {
    console.log('loadInvoices():', page )
    return (dispatch, getState) => {
        let state = getState();
        let { page, sorting, search } = state.invoices
        let url = `//127.0.0.1:5000/invoices?page=${page}&per_page=10`;
        if(sorting) {
            url+=`&ordering=${sorting}`
        }
        if(search) {
            url+=`&search=${search}`
        }
        dispatch(loadingChanged(true));
        $.get(url, data => {
            setTimeout(() => {
                dispatch(showInvoicesResult(data));
                dispatch(loadingChanged(false));
            }, 1000);
        });
    }
}


export function loadInvoice(id) {
    console.log('loadInvoice():', id )
    if (id === 'create')
      return (dispatch, getState) => {}
    return (dispatch, getState) => {
        let url = `//127.0.0.1:5000/invoices/${id}`;
        dispatch(loadingChanged(true));
        $.get(url, function(data) {
            console.log('-----------------------------------------------');
            dispatch(showInvoiceResult(data));
            dispatch(loadingChanged(false));
        });
    }
}

