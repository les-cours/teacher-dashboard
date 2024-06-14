import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import styles from "./classrooms.module.css";
import { LOAD_CLASSROOM_INFO } from "../GraphQl/Queries";
import { UPDATE_CLASSROOM } from "../GraphQl/Mutations";
import { v4 as uuidv4 } from "uuid";

function ClassroomUpdate() {
  let { classroomId } = useParams();
  const { loading, error, data, refetch } = useQuery(LOAD_CLASSROOM_INFO, {
    variables: { classRoomID: classroomId },
  });
     const [updateClassroom] = useMutation(UPDATE_CLASSROOM);
  const [isEditable, setIsEditable] = useState(false);
  const [initialClassRoomData, setInitialClassRoomData] = useState(null);
  const [classRoomData, setClassRoomData] = useState({
    title: "",
    price: "",
    image: "",
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
        price: data.classRoom.price,
        image: data.classRoom.image,
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
    try {
      await updateClassroom({
        variables: {
          classRoomID: classroomId,
          title: classRoomData.title,
          price: classRoomData.price,
          image: classRoomData.image,
          arabicTitle: classRoomData.arabicTitle,
          description: classRoomData.description,
          arabicDescription: classRoomData.arabicDescription,
        },
      });
      setIsEditable(false);
    refetch()
    } catch (error) {
      console.error("Error updating Classroom:", error);
    }
  };

  const handleIgnore = () => {
    setClassRoomData(initialClassRoomData);
    setIsEditable(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.ClassroomUpdate}>
      <div>
        <h2>قسم {classRoomData.arabicTitle}</h2>
      </div>
      <div className={styles.classroomImg}>
        {classRoomData.image ? (
          <img src={classRoomData.image} alt="الفصل الدراسي" />
        ) : (
          <p>لا توجد صورة متاحة</p>
        )}
        <div>
          <input
            className={styles.chooseFileInput}
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
      <div className={styles.classroomInfo}>
        <div>
          <label>العنوان:</label>
          <input
            type="text"
            name="title"
            value={classRoomData.title}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>العنوان بالعربية:</label>
          <input
            type="text"
            name="arabicTitle"
            value={classRoomData.arabicTitle}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>الوصف:</label>
          <textarea
            name="description"
            value={classRoomData.description}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>الوصف بالعربية:</label>
          <textarea
            name="arabicDescription"
            value={classRoomData.arabicDescription}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>السعر:</label>
          <input
            type="number"
            name="price"
            value={classRoomData.price}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
        </div>

        {isEditable ? (
          <>
            <button onClick={handleSave}>حفظ</button>
            <button onClick={handleIgnore}>تجاهل</button>
          </>
        ) : (
          <button onClick={() => setIsEditable(true)}>تحديث</button>
        )}
      </div>
    </div>
  );
}

export default ClassroomUpdate;
