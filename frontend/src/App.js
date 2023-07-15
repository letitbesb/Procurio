import './App.css';
import React from 'react';
import Header from './components/layout/Header/Header.js';
import Footer from './components/layout/Footer/Footer.js';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import webfont from "webfontloader";
import Home from './components/Home/Home.js'


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
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
