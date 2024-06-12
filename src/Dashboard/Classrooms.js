import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LOAD_MY_CLASSROOMS } from "../GraphQl/Queries";
import styles from "./classrooms.module.css";
import arabe from "./arabe.png";
import { Link } from "react-router-dom";

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
              src={arabe}
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
                <small>2h ago</small>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* {data.MyClassRoomsTeacher.map((classroom) => (
        <Link
          key={classroom.classRoomID}
          className={styles.classroom}
          to={`/classrooms/${classroom.classRoomID}`}
        >
          <img src={arabe} alt={arabe} />
          <h2>{classroom.arabicTitle}</h2>
          <p>عدد الوحدات {classroom.chapters.length}</p>
          <p>السعر {classroom.price}</p>
          <p>التقييم {classroom.rating}</p>
          <p>عدد التلاميد {classroom.studentCount}</p>
        </Link>
      ))} */}
    </div>
  );
}

export default Classrooms;
