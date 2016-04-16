
//http://stackoverflow.com/a/5158301/119071
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const INVOICES_INITIAL = {
    rows: [],
    count: 0,
    page: 0,
    sorting: getParameterByName('sorting'),
    search: getParameterByName('search'),
    invoice: {},
}

const invoices = (state=INVOICES_INITIAL, action) => {
    console.log('reducers.invoices:', action.type, state, action);
    let idx = 0;
    switch (action.type) {
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

export default invoices;
