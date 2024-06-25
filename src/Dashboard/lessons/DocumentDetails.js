import React from "react";
import styles from "./Video.module.css";
import Comments from "./Comments";
import { CREATE_COMMENT } from "../../GraphQl/Mutations";
import { useMutation, useQuery } from "@apollo/client";
import { GET_COMMENTS } from "../../GraphQl/Queries";

function DocumentDetails({ document }) {
  const { loading: queryLoading, error: queryError, data: { comments = [] } = {}, refetch } = useQuery(GET_COMMENTS, {
    variables: {
      documentID: document.documentID,
      replied: false,
    },
  });
  
  const [createComment] = useMutation(CREATE_COMMENT, {
    update: (cache, { data: { createComment } }) => {
      const { comments: existingComments = [] } = cache.readQuery({
        query: GET_COMMENTS,
        variables: { documentID: document.documentID, replied: false },
      });

      cache.writeQuery({
        query: GET_COMMENTS,
        variables: { documentID: document.documentID, replied: false },
        data: {
          comments: [...existingComments, createComment],
        },
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({
        variables: {
          content: e.target[0].value,
          documentID: document.documentID,
          isTeacher: true,
        },
      });
      e.target[0].value = "";
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  if (queryLoading) return <p>تحميل التعليقات ...</p>;
  if (queryError) return <p>خطأ في تحميل التعليقات {queryError.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.videoContainer}>
          <p>{document.id}</p>

          {document.documentLink ? (
            <video controls height="100%" width="100%">
              <source src={document.documentLink} type="video/mp4" />
            </video>
          ) : (
            <p>ليس هناك فيديو</p>
          )}
        </div>
        <div>
          <h3>{document.arabicTitle}</h3>
          <p>{document.arabicDescription}</p>
        </div>

        <div className={styles.commentsContainer}>
          <h3>التعليقات : </h3>
          <form onSubmit={handleSubmit} style={{marginBottom:"5px"}}>
            <div className={styles.commentInput}>
              <input
            
                type="text"
                placeholder="اضافة تعليق ..."
                required
              />
                <button type="submit">
              تعليق
            </button>
            </div>
          
          </form>

          {comments.length !== 0 ? (
            <Comments comments={comments} />
          ) : (
            <div>
              <p>لا توجد تعليقات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentDetails;
