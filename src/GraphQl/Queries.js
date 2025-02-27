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
export const LOAD_MY_CLASSROOMS = gql`
  query GetMyClassRoomsTeacher {
    MyClassRoomsTeacher {
      classRoomID
      title
      image
      price
      badge
      studentCount
      rating
      arabicTitle
      description
      arabicDescription
      chapters {
        chapterID
        title
        arabicTitle
        arabicDescription
        lessons {
          lessonID
          arabicTitle
          title
          description
          arabicDescription
        }
      }
    }
  }
`;
export const LOAD_MY_CHATROOMS = gql`
  query GetMyClassRoomsTeacher {
    MyClassRoomsTeacher {
      classRoomID
      title
      image
      studentCount
      arabicTitle
      description
      arabicDescription
    }
  }
`;
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
`;

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
export const LOAD_LESSON_DETAILS = gql`
  query Lessons($chapterID: String!) {
    lessons(chapterID: $chapterID) {
      lessonID
      title
      arabicTitle
      description
      arabicDescription
      documents {
        documentID
        documentType
        title
        arabicTitle
        description
        arabicDescription
        duration {
          hours
          minutes
          seconds
          nanoseconds
        }
        lectureNumber
        documentLink
      }
    }
  }
`;
export const GET_DOCUMENTS = `
  query GetDocuments($lessonID: String!) {
  documents(lessonID: $lessonID) {
    documentID
    documentType
    title
    arabicTitle
    description
    arabicDescription
    duration {
      hours
      minutes
      seconds
    }
    lectureNumber
    documentLink
  }
}

`;

export const GET_COMMENTS = gql`
  query Comments($documentID: String!, $replied: Boolean!) {
    comments(documentID: $documentID, replied: $replied) {
      id
      user {
        id
        username
        firstName
        lastName
        avatar
      }
      repliedTo
      content
      documentID
      timestamp
      isTeacher
      edited
    }
  }
`;
export const LOAD_ROOM_MESSAGES = gql`
  query GetRoomMessages($roomID: String!) {
    room(roomID: $roomID) {
      name
      teacher {
        id
        username
      }
      users {
        id
        paid
      }
      messages {
        id
        message
        timestamp
        isTeacher
        owner {
          username
          lastName
          paid
          avatar
        }
      }
    }
  }
`;
export const LOAD_CHAT_USERS = gql`
query GetRoomUsers($roomID: String!) {
  room(roomID: $roomID) {
    users {
      id
      username
      firstName
      lastName
      avatar
      paid
    }
  }
}`

