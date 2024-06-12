import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarEmpty,
} from "@fortawesome/free-solid-svg-icons";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          style={{ color: "var(--primary-color)" }}
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStarHalfAlt}
          style={{ color: `var(--primary-color)` }}
        />
      );
    } else {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStarEmpty}
          style={{ color: `var(--primary-color)` }}
        />
      );
    }
  }

  return <div>{stars}</div>;
};

export default StarRating;
