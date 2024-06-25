import React from 'react'

import './App.css'
function Home() {

    const totalCourses = 3;
    const totalStudents = 63;
    const averageGrade = 'B+';
    const topCourse = 'Mathematics';
    const topCourseEnrollment = 25;

    

  return (
<div className="statistics">
  <h2>نظرة عامة على الإحصائيات</h2>
  <div className="metrics">
    <div className="metric">
      <h3>إجمالي الدورات</h3>
      <p>{totalCourses}</p>
    </div>
    <div className="metric">
      <h3>إجمالي الطلاب المسجلين</h3>
      <p>{totalStudents}</p>
    </div>
    <div className="metric">
      <h3>المعدل التقريبي</h3>
      <p>{averageGrade}</p>
    </div>
    <div className="metric">
      <h3>أعلى دورة</h3>
      <p>{topCourse}</p>
      <p>التسجيل: {topCourseEnrollment}</p>
    </div>
  </div>
</div>

  )
}

export default Home