import React, { useState, useEffect } from "react";
import styles from "./Video.module.css";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faFilePdf,
  faVideo,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function Comment({ comment }) {
  const [showReplies, setShowReplies] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
      }
    }
  }, []);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <img src={comment.user.avatar} alt="Avatar" />
      </div>
      <div>
        <div className={styles.commentHeader}>
          <div>{comment.user.username}</div>
          <div className={styles.iconsd}>
            {userId === comment.user.id && (
              <button>
                <FontAwesomeIcon icon={faEdit} color="black" />
              </button>
            )}
            <button>
              <FontAwesomeIcon icon={faTrashAlt} color="black" />
            </button>
          </div>
        </div>
        <div>
          <div className={styles.content}>
            <p>{comment.content}</p>
            <button onClick={toggleReplies}>
              {showReplies ? "إخفاء الردود" : "عرض الردود (2)"}
            </button>
          </div>

          {showReplies && (
            <div className={styles.repliesContainer}>
              <div className={styles.replies}>
                <p> الرد 1</p>
              </div>
              <div className={styles.replies}>
                {" "}
                <p> الرد 2</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
