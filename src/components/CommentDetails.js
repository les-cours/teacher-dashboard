import React, { useState } from "react";
import styles from "./components.module.css";
import { useQuery } from "@apollo/client";
import { GET_COMMENTS } from "../GraphQl/Queries";
import ReplyForm from "./ReplyForm";

function CommentDetails({ comment, userID }) {
  const [showReplies, setShowReplies] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState(true);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const toggleResponse = () => {
    setShowResponseForm(!showResponseForm);
  };

  const user = comment.user;

  const {
    loading: queryLoading,
    error: queryError,
    data: { comments: replies = [] } = {},
    refetch,
  } = useQuery(GET_COMMENTS, {
    variables: {
      documentID: comment.id,
      replied: true,
    },
    skip: !showReplies,
  });

  return (
    <div className={styles.commentWithReplies}>
      <div className={styles.comment}>
        <div className={styles.avatar}>
          {user.avatar && user.avatar.includes("<svg") ? (
            <div dangerouslySetInnerHTML={{ __html: user.avatar }} />
          ) : (
            <img src={user.avatar} alt="Avatar" />
          )}
        </div>
        <div className={styles.commentContent}>
          <div className={styles.commentHeader}>
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            {console.log(comment.timestamp)}
            <time>
              {new Date(comment.timestamp * 1000).toLocaleString("ar-DZ", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
          <p>{comment.content} </p>

          <button
            onClick={() => {
              toggleResponse();
            }}
          >
            الرد
          </button>
          <button
            onClick={() => {
              toggleReplies();
            }}
          >
            عرض الردود
          </button>
        </div>
      </div>

      {showReplies && (
        <div className={styles.replies}>
          {replies.map((reply) => (
            <CommentDetails comment={reply} />
          ))}
        </div>
      )}

      {showResponseForm && (
        <ReplyForm id={comment.id} documentID={comment.documentID} />
      )}
    </div>
  );
}

export default CommentDetails;
