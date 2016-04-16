
const ui = (state={}, action) => {
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

export default ui;
