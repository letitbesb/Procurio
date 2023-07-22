import axios from "axios";

import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    CLEAR_ERRORS
} from '../constants/productConstants.js';


//here the main functions are there which will be called by any component to render the data and store on its store!

//get all products
export const getProduct =()=> async (dispatch)=>{
    try{
        dispatch({type:ALL_PRODUCT_REQUEST});
        // console.log("weh here")
        const {data}=await axios.get("/api/v1/products"); //fetch data from backend //get all products here
        //we got data from backend and now we're dsiapatching it to the redudcer guys to send it to the 'store' using dispatch return 
        dispatch({
            type:ALL_PRODUCT_SUCCESS,
            payload: data,
        })
    }
    catch(error){
        // console.log(error.response.data)
        dispatch({  //this dispatch will tell ki error happened so now in the stire it would be updated
            type:ALL_PRODUCT_FAIL,  //this is action.type! which ecides what to do in the switch statement in productReducer
            payload:error.response.data.error,
        });
    }
};


// Get Products Details
export const getProductDetails = (id) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_DETAILS_REQUEST });
            // console.log("aya")
      const { data } = await axios.get(`/api/v1/products/${id}`);
        // console.log("now printing stuff :"+ data);
      dispatch({
        type: PRODUCT_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
        // console.log(error)
      dispatch({
        type: PRODUCT_DETAILS_FAIL,
        payload: error.response.data.error,
      });
    }
  };

//this is to clear all the errors and make them null
export const clearErrors =()=> async (dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
}
