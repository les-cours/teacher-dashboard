import React, { useState, useEffect } from "react";
import styles from "./ChatRoom.module.css";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_CHAT_USERS,
  LOAD_MY_CHATROOMS,
  LOAD_ROOM_MESSAGES,
} from "../GraphQl/Queries";
import { CREATE_MESSAGE } from "../GraphQl/Mutations";

function ChatRoom() {
  const [userId, setUserId] = useState(null);
  const [selectedRoomID, setSelectedRoomID] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUserId(parsedUserInfo.id);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("No userInfo found in localStorage.");
    }
  }, []);

  const {
    loading: loadingRooms,
    error: errorRooms,
    data: dataRooms,
  } = useQuery(LOAD_MY_CHATROOMS);
  const {
    loading: loadingMessages,
    error: errorMessages,
    data: dataMessages,
    refetch,
  } = useQuery(LOAD_ROOM_MESSAGES, {
    variables: { roomID: selectedRoomID },
    skip: !selectedRoomID, // Skip query if no room is selected
  });
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(LOAD_CHAT_USERS, {
    variables: { roomID: selectedRoomID },
    skip: !selectedRoomID, // Skip query if no room is selected
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);

  const handleRoomClick = (roomID) => {
    setSelectedRoomID(roomID);
  };

  const parseDate = (dateString) => {
    const relevantPart = dateString.split(" +")[0];
    return new Date(relevantPart);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    console.log(selectedRoomID, messageInput, userId);
    try {
      const response = await createMessage({
        variables: {
          roomID: selectedRoomID,
          message: messageInput,
          isTeacher: true, // Example value, adjust as per your logic
          ownerID: userId, // Example value, replace with actual owner ID logic
        },
      });

      if (response.data.createMessage.succeeded) {
        // After sending the message, refetch messages to update the chat
        await refetch();
        // Clear the message input field after sending
        setMessageInput("");
      } else {
        // Handle failure scenario
        console.error("Failed to create message");
      }
    } catch (error) {
      console.error("Error creating message", error);
    }
  };

  if (loadingRooms) return <p>Loading rooms...</p>;
  if (errorRooms) return <p>Error loading rooms: {errorRooms.message}</p>;

  return (
    <div className={styles.ChatRoomPage}>
      <div className={styles.ChatRooms}>
        {dataRooms?.MyClassRoomsTeacher.map((c) => (
          <div
            key={c.classRoomID}
            className={styles.chouaib}
            onClick={() => handleRoomClick(c.classRoomID)}
          >
            <h4>{c.arabicTitle}</h4>
            <small>{c.studentCount} تلميذ</small>
          </div>
        ))}
      </div>
      <div className={styles.Chat}>
        <div className={styles.messages}>
          {loadingMessages && <p>Loading messages...</p>}
          {errorMessages && (
            <p>Error loading messages: {errorMessages.message}</p>
          )}
          {dataMessages &&
            dataMessages.room.messages.map((message) => (
              <div key={message.id} className={styles.message}>
                <p>
                  <strong>{message.owner.username}</strong>: {message.message}
                </p>
                <small>{parseDate(message.timestamp).toLocaleString()}</small>
              </div>
            ))}
        </div>
        <form onSubmit={handleSubmitMessage} className={styles.messageForm}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.messageInput}
            required
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
      <div className={styles.Students}>
        {loadingUsers && <p>Loading users...</p>}
        {errorUsers && <p>Error loading users: {errorUsers.message}</p>}
        {dataUsers &&
          dataUsers.room.users.map((user) => (
            <div key={user.id} className={styles.student}>

              <div className={styles.avatar}>
                {user.avatar && user.avatar.includes("<svg") ? (
                  <div dangerouslySetInnerHTML={{ __html: user.avatar }} />
                ) : (
                  <img src={user.avatar} alt="Avatar" />
                )}
              </div>
              
              <div>
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p>{user.username}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChatRoom;
