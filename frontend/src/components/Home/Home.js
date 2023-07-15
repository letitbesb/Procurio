import React, { Fragment,useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import Typed from 'typed.js';
import MetaData from "../layout/MetaData/MetaData";
import { getProduct } from "../../actions/productAction";
import { useDispatch ,useSelector} from "react-redux";
// import Loader from "../layout/Loader/Loader.js";
// import { useAlert } from "react-alert";

const product  = {
    name : "Blue Tshirt",
    images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],
    price: "Rs.3000",
    _id:"shreyash",
};
const Home = () => {
//   const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products,productCount} = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Welcome to Procurio ^1000', 'Your Favourite Shopping Destination!'],
      typeSpeed: 80,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  return (
    <Fragment>
      {/* {loading ? (
        <Loader />
      ) : ( */}
        <Fragment>
          <MetaData title="Procurio" />

          <div className="banner">
            <h1><span ref={el} /></h1>
            {/* <p>Welcome to Procurio</p> */}
            <h1>HAPPY SHOPPING STARTS NOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                 <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      {/* )} */}
    </Fragment>
  );
};

export default Home;