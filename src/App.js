import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import "./App.css";
import Classrooms from "./Dashboard/Classrooms";
import Dashboard from "./Dashboard/Dashboard";
import NavBar from "./NavBar/NavBar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Lessons from "./Dashboard/Lessons";
import ClassroomUpdate from "./Dashboard/ClassroomUpdate";
import LessonDetails from "./Dashboard/lessons/LessonDetails";
import { useEffect, useState } from "react";
import Login from "./Login";
import TeacherRegister from "./Auth/TeacherRegister";
import Profil from "./Profil/Profil";
import ChapterUpdate from "./Dashboard/Chapters/ChapterUpdate";
import AddLesson from "./Dashboard/lessons/AddLesson";
import AddChapter from "./Dashboard/Chapters/AddChapter";

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.forEach(({ message }) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:9090/graphql" }),
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setConnected(true);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {connected && <NavBar setConnected={setConnected} />}
        <Routes>
          {connected ? (
            <>
              <Route path="/home" element={<></>} />
              <Route path="/aboutUs" element={<div>About Us</div>} />
              <Route path="/contactUs" element={<div>Contact Us</div>} />
              <Route path="/dashboard" element={<Dashboard />}>
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
              <Route path="/profil" element={<Profil />} />
              <Route path="/logout" element={<div>Logout</div>} />
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
