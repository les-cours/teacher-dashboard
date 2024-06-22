import React from 'react'
import Comment from './Comment'
import styles from "./Video.module.css"
function Comments({comments}) {
  return (
    <div className={styles.comments}>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default Comments