import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LOAD_MY_CLASSROOMS } from "../GraphQl/Queries";
import styles from "./classrooms.module.css";
import arabe from "./arabe.png";
import { Link } from "react-router-dom";
import StarRating from "../components/StartRating";

function Classrooms() {
  const { loading, error, data } = useQuery(LOAD_MY_CLASSROOMS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data.MyClassRoomsTeacher);
  return (
    <div className={styles.classrooms}>
      {data.MyClassRoomsTeacher.map((c) => (
        <div className={styles.card}>
          <div className={styles.card__header}>
            <img
            src={c.image}
             
              alt="card__image"
              className={styles.card__image}
              width="600"
            />
          </div>
          <div className={styles.card__body}>
            <span className={`${styles.tag} ${styles.tagBlue}`}>
              {c.chapters.length} وحدة
            </span>
            <h4>{c.arabicTitle}</h4>
            <p>{c.description}</p>
          </div>
          <div className={styles.card__footer}>
            <div className={styles.user}>
              <div className={styles.user__info}>
                <h5>{c.price} دج </h5>
                <small>{c.studentCount} تلميذ</small>

                <StarRating rating={c.rating} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Classrooms;
