import React, { useEffect, useState } from "react";
import Select from "react-select";
import {jwtDecode} from "jwt-decode"; 
import "./Profil.css";
import { UPDATE_TEACHER } from "../GraphQl/Mutations";
import { LOAD_CITIES } from "../GraphQl/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebase";

function Profil() {
  const [imageUpload, setImageUpload] = useState(null);
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
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const teacherId = decodedToken.id;
      const firstName = decodedToken.firstname;
      const lastName = decodedToken.lastname;
      setFormData((prevFormData) => ({
        ...prevFormData,
        teacherId: teacherId,
        firstName: firstName,
        lastName: lastName,
      }));
    } else {
      // Handle token absence if necessary
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      try {
        const snapshot = await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(snapshot.ref);
        setFormData((prevFormData) => ({ ...prevFormData, avatar: url }));

        const { data } = await updateTeacher({
          variables: {
            description: formData.description,
            teacherID: formData.teacherId,
            gender: formData.gender,
            dob: formData.birthDate,
            firstname: formData.firstName,
            lastname: formData.lastName,
            cityID: formData.city,
            avatar: url, 
          },
        });
        console.log("Teacher updated successfully:", data);
      } catch (error) {
        console.error("Error uploading image or updating teacher:", error);
      }
    } else {
      
      console.error("No image uploaded.");
    }
  };

  if (loading) return <p>جاري ...</p>;
  if (error) return <p>خطا في تحميل المدن</p>;

  return (
    <div className="profilContainer">
      <div className="profilForm">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">الاسم:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lastName">اللقب:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="birthDate">تاريخ الميلاد:</label>
            <input
              type="text"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">رقم الهاتف:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>المدينة</label>
            <Select
              placeholder={<div>اختر مدينتك</div>}
              isSearchable={true}
              options={cityOptions}
              onChange={handleCityChange}
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
          <div>
            <label>الجنس:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">اختر الجنس</option>
              <option value="M">ذكر</option>
              <option value="F">أنثى</option>
            </select>
          </div>
          <div className="App">
            <input
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Profil;
