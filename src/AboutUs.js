import React, { useState } from "react";
import styles from "./Video.module.css";
import Comments from "./Comments";
function AboutUs() {
  const comments = [
    {
        id: 'd8dcd3f6-1648-4ed2-8552-dae239dcf559',
        user: {
          id: 'd8dcd3f6-1648-4ed2-8552-dae239dcf559',
          username: 'bilal_ab',
          firstName: 'bilal',
          lastName: 'abbas',
          avatar: 'avatar'
        },
        repliedTo: null,
        content: 'ناقص الاستاد هدا',
        documentID: 'video/2',
        timestamp: 15623,
        edited: false,
        isTeacher: true
      },
      {
        id: '2',
        user: {
          id: 'user1',
          username: 'bilal_ab',
          firstName: 'bilal',
          lastName: 'abbas',
          avatar: 'avatar'
        },
        repliedTo: null,
        content: 'ناقص الاستاد هدا',
        documentID: 'video/2',
        timestamp: 15623,
        edited: false,
        isTeacher: true
      },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.videoContainer}></div>
        <div>
          <h3>title</h3>
          <p>description</p>
        </div>
        <div className={styles.commentsContainer}>
          <h3>التعليقات : </h3>
          {comments.length !== 0 ? (
            <Comments comments={comments} />
          ) : (
            <div>
              <p>لا توجد تعليقات </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
