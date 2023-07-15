import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS
} from '../constants/productConstants.js';

export const productReducer= 
    (state={products:[]},
    action)=>{
    switch(action.type){
        case ALL_PRODUCT_REQUEST:
            return {
                loading:true,  //request hai to loading to ho hi raha hoga
                product:[],
            };
        case ALL_PRODUCT_SUCCESS:
            return {
                loading:false,
                products:action.payload.prods,
                productsCount:action.payload.prodCount,
            };
        case ALL_PRODUCT_FAIL:
            return {
                loading:false,
                error:action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null,   //point of this call was to make error null,so...
            };
        default:
            return state;
    }
};