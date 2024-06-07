import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_CLASSROOMS } from '../GraphQl/Queries';
import { jwtDecode } from 'jwt-decode';
import './classrooms.css'
import arabe from './arabe.png'
import { Link } from 'react-router-dom';
function Classrooms() {
  const [teacherId, setteacherId] = useState(null);
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
       console.log(decodedToken);
      const teacherId = decodedToken.id;
      setteacherId(teacherId)
    } 
  }, []);
  const { loading, error, data } = useQuery(LOAD_CLASSROOMS, {
    variables: { teacherID: teacherId }, 
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
   console.log(data.classRoomsTeacher)
  return (
    <div className='classroomsDiv'>

      {data.classRoomsTeacher.map(classroom => (
        <Link key={classroom.classRoomID} className='classrooms' to={`/dashboard/classrooms/${classroom.classRoomID}`}>
          {/* <img src={classroom.image} alt='no image '/> */}
          <img src={arabe} alt={arabe}/>
          <h2>{classroom.arabicTitle}</h2>
          <p>عدد الوحدات {classroom.chapters.length}</p>
          <p>السعر {classroom.price}</p>
          <p>التقييم {classroom.rating}</p>
          <p>عدد التلاميد {classroom.studentCount}</p>
        </Link>
      ))}
    </div>
  );
}

export default Classrooms;
