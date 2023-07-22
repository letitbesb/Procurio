import React, { Fragment, useEffect ,useState} from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails, clearErrors } from "../../actions/productAction";
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData/MetaData';
import { Rating } from "@material-ui/lab";
import ReviewCard from "./ReviewCard";
import { useAlert } from "react-alert";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
  } from "@material-ui/core";

const ProductDetails = ({ }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { id } = useParams();
    const {product,loading,error} = useSelector(state=>state.productDetails)
    // console.log(id);
    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
      };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

//   const addToCartHandler = () => {
//     dispatch(addItemsToCart(match.params.id, quantity));
//     alert.success("Item Added To Cart");
//   };

//   const submitReviewToggle = () => {
//     open ? setOpen(false) : setOpen(true);
//   };

//   const reviewSubmitHandler = () => {
//     const myForm = new FormData();

//     myForm.set("rating", rating);
//     myForm.set("comment", comment);
//     myForm.set("productId", match.params.id);

//     dispatch(newReview(myForm));

//     setOpen(false);
//   };

  useEffect(() => {
        if (error) {
        alert.error(error);
        dispatch(clearErrors());
        }

        // if (reviewError) {
        // alert.error(reviewError);
        // dispatch(clearErrors());
        // }

        // if (success) {
        // alert.success("Review Submitted Successfully");
        // dispatch({ type: NEW_REVIEW_RESET });
        // }
        
        dispatch(getProductDetails(id));
    }, [dispatch, id,error,alert]);
    return (
        <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <MetaData title={`${product.name} -- ECOMMERCE`} />
            <div className="ProductDetails">
              <div>
                <Carousel>
                {product.images &&
                    product.images.map((item, i) => (
                    <div key={i}>
                        <img className="CarouselImage" src={item.url} alt={`${i} Slide`} />
                    </div>
                    ))}
                </Carousel>
              </div>
  
              <div>
                <div className="detailsBlock-1">
                  <h2>{product.name}</h2>
                  <p>Product # {product._id}</p>
                </div>
                <div className="detailsBlock-2">
                  <Rating {...options} />
                  <span className="detailsBlock-2-span">
                    {" "}
                    ({product.numOfReviews} Reviews)
                  </span>
                </div>
                <div className="detailsBlock-3">
                  <h1>{`₹${product.price}`}</h1>
                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input readOnly type="number" value={quantity} />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button
                    //   disabled={product.Stock < 1 ? true : false}
                    //   onClick={addToCartHandler}
                    >
                      Add to Cart
                    </button>
                  </div>
  
                  <p>
                    Status:
                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                      {product.Stock < 1 ? "OutOfStock" : "InStock"}
                    </b>
                  </p>
                </div>
  
                <div className="detailsBlock-4">
                  Description : <p>{product.description}</p>
                </div>
  
                <button className="submitReview">
                  Submit Review
                </button>
              </div>
            </div>
  
            <h3 className="reviewsHeading">REVIEWS</h3>
            {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
            {/* <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={submitReviewToggle}
            > */}
              {/* <DialogTitle>Submit Review</DialogTitle> */}
              {/* <DialogContent className="submitDialog">
                <Rating
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  size="large"
                />
  
                <textarea
                  className="submitDialogTextArea"
                  cols="30"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent> */}
              {/* <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button onClick={reviewSubmitHandler} color="primary">
                  Submit
                </Button>
              </DialogActions> */}
            {/* </Dialog> */}
  
          
          </Fragment>
        )}
      </Fragment>
                
    );
};

export default ProductDetails;