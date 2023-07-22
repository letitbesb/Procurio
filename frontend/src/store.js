import {createStore,combineReducers,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import { productReducer,productDetailsReducer } from "./reducers/productReducer";

const reducer = combineReducers({
    //using this to combine the reducer cause we wanna fetch more than one lots of stuff 
    //btw lhs wala name you can give whatever YOU want its fine
    //these lhs names are used and imp at the place where the useSelector is used to pull data 
    products: productReducer,
    productDetails: productDetailsReducer
});

let initialState={};

const middleware =[thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;