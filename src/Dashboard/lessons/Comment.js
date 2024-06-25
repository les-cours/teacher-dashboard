import React, { useState, useEffect } from "react";
import styles from "./Video.module.css";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_REPLY } from "../../GraphQl/Mutations";

import { GET_COMMENTS } from "../../GraphQl/Queries";
import CommentDetails from "../../components/CommentDetails";

function Comment({ comment }) {


 
  const [userId, setUserId] = useState(null);

  useEffect(() => {
   const user = JSON.parse( localStorage.getItem("userInfo"));
   setUserId(user.id)
  }, []);


  return (
<div className={styles.comment  }>

<CommentDetails comment={comment} userID={userId}/>





</div>
  );
}

export default Comment;
