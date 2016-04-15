
export const notification = (state={}, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            let { notification_type, message } = action
            return Object.assign({}, state, {
                message,
                notification_type,
            })
        case 'CLEAR_NOTIFICATION':
            return {}
    }
    return state;
}


export const ui = (state={}, action) => {
    switch (action.type) {
        case 'IS_LOADING':
            return Object.assign({}, state, {
                isLoading: action.isLoading
            });
            break;
        case 'IS_SUBMITTING':
            return Object.assign({}, state, {
                isSubmitting: action.isSubmitting
            });
            break;
    }
    return state;
}

//http://stackoverflow.com/a/5158301/119071
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const PATH_INITIAL = {
  path: '/'
}

export const path = (state=PATH_INITIAL, action) => {
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return Object.assign({}, state, {
                path: action.
            });
    };
    return state;
}

const INVOICES_INITIAL = {
    rows: [],
    count: 0,
    page: 0,
    sorting: getParameterByName('sorting'),
    search: getParameterByName('search'),
    invoice: {},
}

export const invoices = (state=INVOICES_INITIAL, action) => {
    console.log('reducers.invoices:', action.type, state, action);
    let idx = 0;
    switch (action.type) {
        case 'LOCATION_CHANGE':
            return Object.assign({}, state, {
                path: 
            });
        case 'SHOW_INVOICES':
            return Object.assign({}, state, {
                rows: action.invoices,
                count: action.invoices.length,
            });
            break;
        case 'SHOW_INVOICE':
            return Object.assign({}, state, {
                invoice: action.invoice
            });
            break;
        case 'CHANGE_PAGE':
            return Object.assign({}, state, {
                page: action.page
            });
            break;
        case 'TOGGLE_SORTING':
            return Object.assign({}, state, {
                sorting: (state.sorting==action.sorting)?('-'+action.sorting):action.sorting
            });
            break;
        case 'CHANGE_SEARCH':
            return Object.assign({}, state, {
                search: action.search
            });
            break;
        case 'ADD_INVOICE':
            return Object.assign({}, state, {
                invoice: action.invoice,
                count: state.count+1,
                rows: [
                    ...state.rows,
                    action.invoice,
                ]
            });
        case 'UPDATE_INVOICE':
            idx = state.rows.findIndex( r => r.id === action.invoice.id)
            if(idx==-1) {
                return Object.assign({}, state, {
                    invoice: action.invoice
                });
            } else {
                return Object.assign({}, state, {
                    invoice: action.invoice,
                    rows: [
                        ...state.rows.slice(0, idx),
                        action.invoice,
                        ...state.rows.slice(idx+1),
                    ]
                });
            }
            break;
        case 'DELETE_INVOICE':
            idx = state.rows.findIndex( r => r.id == action.id)
            if(idx==-1) {
                return Object.assign({}, state, {
                    invoice: undefined
                });
            } else {
                return Object.assign({}, state, {
                    invoice: undefined,
                    count: state.count-1,
                    rows: [
                        ...state.rows.slice(0, idx),
                        ...state.rows.slice(idx+1),
                    ]
                });
            }
            break;

    }
    return state;
}

