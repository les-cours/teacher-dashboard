import React, { useState, useEffect } from "react";
import styles from "./Video.module.css";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_REPLY } from "../../GraphQl/Mutations";

import { GET_COMMENTS } from "../../GraphQl/Queries";
import CommentDetails from "../../components/CommentDetails";

function Comment({ comment }) {


  const [replyContent, setReplyContent] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
   const user = JSON.parse( localStorage.getItem("userInfo"));
   setUserId(user.id)
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
<div className={styles.comment  }>

<CommentDetails comment={comment} userID={userId}/>





</div>
  );
}

export default Comment;
