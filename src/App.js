import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Classrooms from "./Dashboard/Classrooms";
import Dashboard from "./Dashboard/Dashboard";
import NavBar from "./NavBar/NavBar";
import Lessons from "./Dashboard/Lessons";
import ClassroomUpdate from "./Dashboard/ClassroomUpdate";
import LessonDetails from "./Dashboard/lessons/LessonDetails";
import Login from "./Login";
import TeacherRegister from "./Auth/TeacherRegister";
import Profil from "./Profil/Profil";
import ChapterUpdate from "./Dashboard/Chapters/ChapterUpdate";
import AddLesson from "./Dashboard/lessons/AddLesson";
import AddChapter from "./Dashboard/Chapters/AddChapter";
import LiveReservation from "./Live/LiveReservation";
import "./App.css";
import Document from "./Dashboard/lessons/Document";
import AboutUs from "./AboutUs";
import ChatRoom from "./chat/ChatRoom";

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.forEach(({ message }) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://127.0.0.1:9090/graphql" }),
]);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

function App() {
  const [connected, setConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setConnected(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {connected && (
          <NavBar setConnected={setConnected} toggleDarkMode={toggleDarkMode} />
        )}
        <Routes>
          {connected ? (
            <>
              <Route
                path="/home"
                element={
                  <div>
                    <div>
                      <h1>Teacher Dashboard</h1>
                      <div>
                        <h2>Overview</h2>
                        <p>Number of Students: {4}</p>
                        <p>Upcoming Events: {4}</p>
                        <p>Recent Grades: {77}</p>
                      </div>
                    </div>
                  </div>
                }
              />
              <Route path="/chatRoom" element={<ChatRoom />} />
              <Route path="/contactUs" element={<div>Contact Us</div>} />
              <Route path="/Live" element={<LiveReservation />} />
              <Route path="/" element={<Dashboard />}>
                <Route path="classrooms" element={<Classrooms />} />
                <Route
                  path="classrooms/:classroomId/addChapter"
                  element={<AddChapter />}
                />
                <Route
                  path="classrooms/:classroomId/:chapterId/addLesson"
                  element={<AddLesson />}
                />
                <Route
                  path="classrooms/:classroomId"
                  element={<ClassroomUpdate />}
                />
                <Route
                  path="classrooms/:classroomId/:chapterId"
                  element={<ChapterUpdate />}
                />
                <Route
                  path="classrooms/:classroomId/:chapterId/:lessonId"
                  element={<LessonDetails />}
                />
              </Route>
              <Route path="/profile" element={<Profil />} />
              <Route path="/logout" element={<div>Logout</div>} />
              {/* <Route path="/video/:lessonId/:documentId" element={<Document />} /> */}
              <Route path="/video/:lessonId" element={<Document />} />

              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={<Login setConnected={setConnected} />}
              />
              <Route
                path="/confirm/:teacherID?"
                element={<TeacherRegister setConnected={setConnected} />}
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
