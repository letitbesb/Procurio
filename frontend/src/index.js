import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import store from "./store";

import {positions,transitions,Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";


const options = { //alert provider being used for showing error and alerts 
  timeout:5000,
  position:positions.BOTTOM_CENTER,
  transition:transitions.SCALE,
}
//now we can use react alert anywhere in our project
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <AlertProvider template={AlertTemplate} {...options}> 
    <App />  
  </AlertProvider>
    
  </Provider>
);

