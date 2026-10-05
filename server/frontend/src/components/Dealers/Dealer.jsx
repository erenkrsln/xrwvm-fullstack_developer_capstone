import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);

  const { id } = useParams();

  const root_url = window.location.origin;

  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}/djangoapp/reviews/dealer/${id}`;
  const post_review = `${root_url}/postreview/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET",
      });

      const retobj = await res.json();

      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer);
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, {
        method: "GET",
      });

      const retobj = await res.json();

      if (retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setUnreviewed(true);
    }
  };

  const senti_icon = (sentiment) => {
    return sentiment === "positive"
      ? positive_icon
      : sentiment === "negative"
      ? negative_icon
      : neutral_icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();

    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review}>
          <img
            src={review_icon}
            style={{
              width: "10%",
              marginLeft: "10px",
              marginTop: "10px",
            }}
            alt="Post Review"
          />
        </a>
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dealer) {
    return (
      <div style={{ margin: "20px" }}>
        <Header />
        <h3>Loading dealer...</h3>
      </div>
    );
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {postReview}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <div>Loading Reviews....</div>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div
              className="review_panel"
              key={review._id || review.id}
            >
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />

              <div className="review">
                {review.review}
              </div>

              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;