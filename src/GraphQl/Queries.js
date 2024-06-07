import { gql } from "@apollo/client";

export const LOAD_CITIES = gql`
  query {
    cities {
      id
      name
      name_ar
    }
  }
`;
export const LOAD_CLASSROOMS =gql`
query GetClassRoomsTeacher($teacherID: String!) {
  classRoomsTeacher(teacherID: $teacherID) {
    classRoomID
    title
    studentCount
    price
    image 
    badge
    rating
    arabicTitle
    description
    arabicDescription

    chapters{
      chapterID
      title
      arabicTitle
      arabicDescription
      lessons{
        lessonID
        title
        description
        arabicDescription
      }
      description
    }
  }
}

`
export const LOAD_CLASSROOM_INFO = gql`
query ClassRoom($classRoomID: String!) {
  classRoom(classRoomID: $classRoomID) {
    classRoomID
    title
    studentCount
    price
    image 
    badge
    rating
    arabicTitle
    description
    arabicDescription
      }
    }
`

export const LOAD_CHAPTERS = gql`
  query GetChapters($classRoomID: String!) {
    chapters(classRoomID: $classRoomID) {
      chapterID
      title
      arabicTitle
      description
      arabicDescription
    }
  }
`;
