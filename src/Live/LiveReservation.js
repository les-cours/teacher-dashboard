import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function LiveReservation() {
    const [sessionData, setSessionData] = useState({
        sessionName: '',
        sessionDate: new Date(),
        duration: 0,
        description: '',
      });
    
    //   const [createSession] = useMutation(CREATE_SESSION);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setSessionData({
          ...sessionData,
          [name]: value,
        });
      };
    
      const handleDateChange = (date) => {
        setSessionData({
          ...sessionData,
          sessionDate: date,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //   const { data } = await createSession({
        //     variables: {
        //       sessionName: sessionData.sessionName,
        //       sessionDate: sessionData.sessionDate.toISOString(),
        //       duration: parseInt(sessionData.duration),
        //       description: sessionData.description,
        //     },
        //   });
        //   console.log('Session created successfully:', data);
        // } catch (error) {
        //   console.error('Error creating session:', error);
        // }
      };
    
      return (
        <div className="schedulerContainer">
          <h2>انشاء حصة مباشرة</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="sessionName">العنوان</label>
              <input
                type="text"
                id="sessionName"
                name="sessionName"
                value={sessionData.sessionName}
                onChange={handleChange}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="sessionDate">التاريخ</label>
              <DatePicker
                selected={sessionData.sessionDate}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="Pp"
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="duration">المدة (minutes):</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={sessionData.duration}
                onChange={handleChange}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="description">الوصف</label>
              <textarea
                id="description"
                name="description"
                value={sessionData.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Create Session</button>
          </form>
        </div>
      );
    }
    
export default LiveReservation;