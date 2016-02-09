export const getActionTypes = (action) => {
    let {type,types} = action;
    if(type) {
        types = [type,type + '_SUCCESS', type + '_FAIL'];
    }
    return types;
};