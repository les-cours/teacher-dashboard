import React, { useState, useEffect } from "react";
import styles from "./Video.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_REPLY } from "../../GraphQl/Mutations";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { GET_COMMENTS } from "../../GraphQl/Queries";

function Comment({ comment }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
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

  const [createReplyMutation, { loading: replyLoading, error: replyError }] =
    useMutation(CREATE_REPLY, {
      onError: (error) => {
        console.error("Error creating reply:", error);
      },
      onCompleted: () => {
        setReplyContent(""); 
       // setShowResponseForm(false); 
      },
      refetchQueries: [
        {
          query: GET_COMMENTS,
          variables: {
            documentID: comment.id,
            replied: true,
          },
        },
      ],
    });

  const { loading: queryLoading, error: queryError, data: { comments: replies = [] } = {}, refetch } = useQuery(GET_COMMENTS, {
    variables: {
      documentID: comment.id,
      replied: true,
    },
    skip: !showReplies,
  });

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const toggleResponse = () => {
    setShowResponseForm(!showResponseForm);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await createReplyMutation({
        variables: {
          content: replyContent,
          repliedTo: comment.id,
          documentID: comment.documentID,
          isTeacher: true, 
        },
      });
    } catch (err) {
      console.error("Error creating reply:", err);
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <img src={comment.user.avatar} alt="Avatar" />
      </div>
      <div className={styles.commentContent}>
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
              {showReplies ? "إخفاء الردود" : "عرض الردود"}
            </button>
            <button onClick={toggleResponse}>
              {showResponseForm ? "إلغاء الرد" : "الرد"}
            </button>
          </div>
          {showResponseForm && (
            <div className={styles.replyForm}>
              <form onSubmit={handleReplySubmit}>
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="أدخل ردك هنا"
                  required
                />
                <button type="submit">إرسال الرد</button>
              </form>
            </div>
          )}
          {showReplies && (
            <div className={styles.repliesContainer}>
              {replies.map((reply) => (
                <div key={reply.id} className={styles.replies}>
                  <p>{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
