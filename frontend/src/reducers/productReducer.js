import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
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
                products:action.payload.prods,  //extracting the products and sending it to the store as 'products' array, notice we destructured {products} in Home.js using useSelector, this name and that name should be the same!
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


export const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {
      case PRODUCT_DETAILS_REQUEST:
        return {
          loading: true,
          ...state,
        };
      case PRODUCT_DETAILS_SUCCESS:
        return {
          loading: false,
          product: action.payload.product,
        };
      case PRODUCT_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };