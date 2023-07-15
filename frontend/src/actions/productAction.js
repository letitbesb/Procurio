import axios from "axios";

import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS
} from '../constants/productConstants.js';

export const getProduct =()=> async (dispatch)=>{
    try{
        dispatch({type:ALL_PRODUCT_REQUEST});
        // console.log("weh here")
        const {data}=await axios.get("/api/v1/products"); //fetch data from backend //get all products here
        // console.log(data);
        dispatch({
            type:ALL_PRODUCT_SUCCESS,
            payload: data,
        })
    }
    catch(error){
        dispatch({  //this dispatch will tell ki error happened so now in the stire it would be updated
            type:ALL_PRODUCT_FAIL,  //this is action.type! which ecides what to do in the switch statement in productReducer
            payload:error.response.data.message,
        });
    }
};


//this is to clear all the errors and make them null
export const clearErrors =()=> async (dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
}
