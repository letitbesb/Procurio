import './App.css';
import React from 'react';
import Header from './components/layout/Header/Header.js';
import Footer from './components/layout/Footer/Footer.js';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import webfont from "webfontloader";
import Home from './components/Home/Home.js'
import ProductDetails from './components/Product/ProductDetails.js';
import Products from "./components/Product/Products.js";

function App() {

  //load before render hence useeffect used
  React.useEffect(() => {
    webfont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"],
      }
    })
    
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
