import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"; 
import "./chapters.css";
import { LOAD_CLASSROOM_INFO } from "../GraphQl/Queries";
// import { UPDATE_CLASSROOM } from "../GraphQl/Mutations";
import { v4 as uuidv4 } from "uuid";

function ClassroomUpdate() {
  let { classroomId } = useParams();
  const { loading, error, data } = useQuery(LOAD_CLASSROOM_INFO, {
    variables: { classRoomID: classroomId },
  });
//   const [updateClassroom] = useMutation(UPDATE_CLASSROOM);
  const [isEditable, setIsEditable] = useState(false);
  const [initialClassRoomData, setInitialClassRoomData] = useState(null);
  const [classRoomData, setClassRoomData] = useState({
    title: "",
    studentCount: "",
    price: "",
    image: "",
    badge: "",
    rating: "",
    arabicTitle: "",
    description: "",
    arabicDescription: "",
  });
  const [imageUpload, setImageUpload] = useState(null);

  // Update state when data is fetched
  useEffect(() => {
    if (data) {
      const fetchedData = {
        title: data.classRoom.title,
        studentCount: data.classRoom.studentCount,
        price: data.classRoom.price,
        image: data.classRoom.image,
        badge: data.classRoom.badge,
        rating: data.classRoom.rating,
        arabicTitle: data.classRoom.arabicTitle,
        description: data.classRoom.description,
        arabicDescription: data.classRoom.arabicDescription,
      };
      setClassRoomData(fetchedData);
      setInitialClassRoomData(fetchedData);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const imageRef = ref(storage, `images/${file.name}-${uuidv4()}`);
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setClassRoomData((prevData) => ({
        ...prevData,
        image: url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // try {
    //   await updateClassroom({
    //     variables: {
    //       classRoomID: classroomId,
    //       title: classRoomData.title,
    //       studentCount: classRoomData.studentCount,
    //       price: classRoomData.price,
    //       image: classRoomData.image,
    //       badge: classRoomData.badge,
    //       rating: classRoomData.rating,
    //       arabicTitle: classRoomData.arabicTitle,
    //       description: classRoomData.description,
    //       arabicDescription: classRoomData.arabicDescription,
    //     },
    //   });
    //   setIsEditable(false);
    // } catch (error) {
    //   console.error("Error updating Classroom:", error);
    // }
  };

  const handleIgnore = () => {
    setClassRoomData(initialClassRoomData);
    setIsEditable(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="ClassroomUpdate" >
      <div>
        <h2>قسم {classRoomData.arabicTitle}</h2>
      </div>
      <div className="classroomImg">
        {classRoomData.image ? (
          <img src={classRoomData.image} alt="Classroom" />
        ) : (
          <p>No photo available</p>
        )}
        <div>
          <input
            className="chooseFileInput"
            type="file"
            disabled={!isEditable}
            onChange={(event) => {
              const file = event.target.files[0];
              setImageUpload(file);
              handleImageUpload(file);
            }}
          />
        </div>
      </div>
      <div className="classroom-info">
        <div><label>Title:</label>
        <input
          type="text"
          name="title"
          value={classRoomData.title}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Student Count:</label>
        <input
          type="number"
          name="studentCount"
          value={classRoomData.studentCount}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Price:</label>
        <input
          type="text"
          name="price"
          value={classRoomData.price}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Badge:</label>
        <input
          type="text"
          name="badge"
          value={classRoomData.badge}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Rating:</label>
        <input
          type="number"
          name="rating"
          value={classRoomData.rating}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Arabic Title:</label>
        <input
          type="text"
          name="arabicTitle"
          value={classRoomData.arabicTitle}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Description:</label>
        <textarea
          name="description"
          value={classRoomData.description}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        <div><label>Arabic Description:</label>
        <textarea
          name="arabicDescription"
          value={classRoomData.arabicDescription}
          disabled={!isEditable}
          onChange={handleInputChange}
        /></div>
        
        {isEditable ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleIgnore}>Ignore</button>
          </>
        ) : (
          <button onClick={() => setIsEditable(true)}>Update</button>
        )}
      </div>
    </div>
  );
}

export default ClassroomUpdate;
