
import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./Profil.css";
import { UPDATE_TEACHER } from "../GraphQl/Mutations";
import { LOAD_CITIES } from "../GraphQl/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebase";

function Profil() {
  const [isEditable, setIsEditable] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: null,
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    gender: "",
    city: 0,
    description: "",
    avatar: ""
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const { id, firstname, lastname, birthDate, phoneNumber, gender, city, description, avatar } = user;
      setFormData({
        teacherId: id,
        firstName: firstname,
        lastName: lastname,
        birthDate: birthDate || "",
        phoneNumber: phoneNumber || "",
        gender: gender || "",
        city: city || 0,
        description: description || "",
        avatar: avatar || ""
      });
      setImagePreviewUrl(avatar); // Set the initial avatar preview if it exists
    }
  }, []);

  const { error, loading, data } = useQuery(LOAD_CITIES);
  const [cityOptions, setCityOptions] = useState([]);
  const [updateTeacher] = useMutation(UPDATE_TEACHER);

  useEffect(() => {
    if (data) {
      const options = data.cities.map((city) => ({
        value: city.id,
        label: city.name_ar,
      }));
      setCityOptions(options);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCityChange = (selectedOption) => {
    setFormData({
      ...formData,
      city: selectedOption ? selectedOption.value : 0,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);

      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result);
        };
        reader.readAsText(file);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleUpdateClick = (e) => {
    setIsEditable(!isEditable);
    if (isEditable) {
      // Create a synthetic event object and call handleSubmit
      handleSubmit({ preventDefault: () => {} });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarUrl = formData.avatar;
  
    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      try {
        const snapshot = await uploadBytes(imageRef, imageUpload);
        avatarUrl = await getDownloadURL(snapshot.ref);
        setFormData((prevFormData) => ({ ...prevFormData, avatar: avatarUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }
  
    try {
      const { data } = await updateTeacher({
        variables: {
          description: formData.description,
          teacherID: formData.teacherId,
          gender: formData.gender,
          dob: formData.birthDate,
          firstname: formData.firstName,
          lastname: formData.lastName,
          cityID: formData.city,
          avatar: avatarUrl,
        },
      });
  
      // Update userInfo in local storage
      const updatedUserInfo = {
        id: formData.teacherId,
        firstname: formData.firstName,
        lastname: formData.lastName,
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        city: formData.city,
        description: formData.description,
        avatar: avatarUrl,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
  
      console.log("Teacher updated successfully:", data);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };
  

  if (loading) return <p>جاري ...</p>;
  if (error) return <p>خطا في تحميل المدن</p>;

  return (
    <div className="profilContainer">
      <div className="profilForm">
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="firstName">الاسم:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              readOnly={!isEditable}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="lastName">اللقب:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditable}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="birthDate">تاريخ الميلاد:</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              readOnly={!isEditable}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="phoneNumber">رقم الهاتف:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              readOnly={!isEditable}
            />
          </div>
          <div className="inputGroup">
            <label>المدينة:</label>
            <Select
              placeholder={<div>اختر مدينتك</div>}
              isSearchable={true}
              options={cityOptions}
              onChange={handleCityChange}
              isDisabled={!isEditable}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 6px",
                }),
                input: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                  margin: "0",
                  width: '100px',
                  caretColor: "transparent",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
            />
          </div>
          <div className="inputGroup">
            <label>الجنس:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditable}
            >
              <option value="">اختر الجنس</option>
              <option value="M">ذكر</option>
              <option value="F">أنثى</option>
            </select>
          </div>
          <div className="inputGroup">
            <label htmlFor="description">الوصف:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              readOnly={!isEditable}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="avatar">الصورة:</label>
            <input
              type="file"
              id="avatar"
              accept="image/*,image/svg+xml"
              onChange={handleImageChange}
              disabled={!isEditable}
            />
          </div>
          {imagePreviewUrl && (
            <div className="avatarPreview">
              <img src={imagePreviewUrl} alt={`${formData.firstName} ${formData.lastName}`} className="avatarImage" />
            </div>
          )}
          <div className="buttonGroup">
            <button type="button" onClick={handleUpdateClick}>
              {isEditable ? "Save" : "Update"}
            </button>
            {isEditable && (
              <button type="button" onClick={() => setIsEditable(false)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profil;
