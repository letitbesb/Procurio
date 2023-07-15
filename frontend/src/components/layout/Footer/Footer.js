import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import './Footer.css';

//3 sections Left footer right footer mid footer
const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Now on Android and IOS</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>Procurio</h1>
        <h4>Your one-stop shopping destination!</h4>

        <p>Copyrights 2023 &copy; letitbesb</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us </h4>
        <a href="http://instagram.com/letitbesb">Instagram</a>
        <a href="http://twitter.com/letitbesb">Twitter</a>
        <a href="http://instagram.com/letitbesb">Facebook</a>
      </div>
    </footer>
  )
}

export default Footer