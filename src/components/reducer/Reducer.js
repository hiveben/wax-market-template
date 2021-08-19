const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ASSET':
            return {
                ...state,
                asset: action.payload
            };
        case 'SET_ACTION':
            return {
                ...state,
                action: action.payload
            };
        case 'SET_SWITCHED_TAB':
            return {
                ...state,
                switchedTab: action.payload
            };
        case 'SET_CALLBACK':
            return {
                ...state,
                callBack: action.payload
            };
        case 'SET_COLLECTIONS':
            return {
                ...state,
                collections: action.payload
            };
        case 'SET_COLLECTION':
            return {
                ...state,
                collections: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;
