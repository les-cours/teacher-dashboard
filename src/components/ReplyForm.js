import React, { useRef, useState } from 'react'
import styles from "./components.module.css";
import { useMutation } from '@apollo/client';
import { CREATE_REPLY } from '../GraphQl/Mutations';
import { GET_COMMENTS } from '../GraphQl/Queries';


function ReplyForm({id,documentID}) {

    const [replyContent, setReplyContent] = useState("");
    const replyRef = useRef()


    const [createReplyMutation, { loading, error }] =
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
            documentID: id,
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
          content: replyRef.current.value,
          repliedTo: id,
          documentID: documentID,
          isTeacher: true,
        },
      });
    } catch (err) {
      console.error("Error creating reply:", err);
    }
  };


  if (loading){

    return <div>loading...</div>
  }


  return (
    <div className={styles.replies}>
    <form onSubmit={handleReplySubmit} style={{marginBottom:"5px"}}>
           <div className={styles.commentInput}>
             <input
               ref={replyRef}
               type="text"
               placeholder="اضافة رد ..."
               required
             />
               <button type="submit" >
             رد
           </button>
           </div>
         
         </form>
    </div>
  )
}

export default ReplyForm