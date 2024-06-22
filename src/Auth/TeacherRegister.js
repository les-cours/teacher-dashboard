import { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery, gql, useMutation } from "@apollo/client";
import styles from "./TeacherRegister.module.css";

import { LOAD_CITIES } from "../GraphQl/Queries";
import { SIGNUP_TEACHER } from "../GraphQl/Mutations";
import { useParams, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function TeacherRegister({ setConnected }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacherID = searchParams.get("teacherID");

  const { error, loading, data } = useQuery(LOAD_CITIES);

  const [cityOptions, setCityOptions] = useState([]);
  const [err, setErr] = useState("");
  const [signupTeacher] = useMutation(SIGNUP_TEACHER);

  useEffect(() => {
    if (data) {
      const options = data.cities.map((city) => ({
        value: city.id,
        label: city.name_ar,
      }));
      setCityOptions(options);
    }
  }, [data]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    gender: "",
    password: "",
    city: 0,
  });

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

    try {
      const { data } = await signupTeacher({
        variables: {
          teacherID: teacherID,
          firstname: formData.firstName,
          lastname: formData.lastName,
          password: formData.password,
          dob: formData.birthDate,
          gender: formData.gender,
          cityID: formData.city,
          description: "formData.description",
        },
      });
      console.log(data.signupTeacher.accessToken.token);
      localStorage.setItem("token", data.signupTeacher.accessToken.token);
      const decodedToken = jwtDecode(data.signupTeacher.accessToken.token);

      const userInfo = {
        id: decodedToken.id,
        userType: decodedToken.userType,
        username: decodedToken.username,
        firstname: decodedToken.firstname,
        lastname: decodedToken.lastname,
        email: decodedToken.email,
        avatar: decodedToken.avatar,
      };
      console.log(userInfo);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setConnected(true);
    } catch (error) {
      setErr(error.message);
      console.error("Error signing up teacher:", error.message);
    }
  };

  if (loading) return <p>جاري ...</p>;
  if (error) return <p>خطا في تحميل المدن</p>;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {err != "" && <p style={{ color: "red" }}>{err}</p>}
        <div>
          <label htmlFor="firstName">الاسم:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
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
            required
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
            required
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
        <div>
          <label htmlFor="password">الباسورد:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {/* <div>
      <label htmlFor="confirmPassword">تاكيد الباسورد:</label>
      <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
    </div> */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TeacherRegister;
