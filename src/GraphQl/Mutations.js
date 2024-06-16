import { gql } from "@apollo/client";

export const SIGNUP_TEACHER = gql`
  mutation SignupTeacher(
    $description: String!
    $teacherID: String!
    $gender: String!
    $dob: String!
    $password: String!
    $firstname: String!
    $lastname: String!
    $cityID: Int!
  ) {
    signupTeacher(
      in: {
        description: $description
        teacherID: $teacherID
        gender: $gender
        dob: $dob
        password: $password
        firstname: $firstname
        lastname: $lastname
        cityID: $cityID
      }
    ) {
      succeeded
      accessToken {
        token
        tokenType
        expiresAt
      }
    }
  }
`;
export const CREATE_CHAPTER = gql`
  mutation CreateChapter(
    $classRoomID: String!
    $title: String!
    $arabicTitle: String!
    $description: String!
  ) {
    createChapter(
      in: {
        classRoomID: $classRoomID
        title: $title
        arabicTitle: $arabicTitle
        description: $description
      }
    ) {
      chapterID
      lessons {
        lessonID
      }
    }
  }
`;

export const CREATE_LESSON = gql`
  mutation CreateLesson(
    $chapterID: String!
    $title: String!
    $arabicTitle: String!
    $description: String!
  ) {
    createLesson(
      in: {
        chapterID: $chapterID
        title: $title
        arabicTitle: $arabicTitle
        description: $description
      }
    ) {
      lessonID
      arabicTitle
      title
      description
    }
  }
`;
export const DELETE_CHAPTER = gql`
  mutation DeleteChapter($id: String!) {
    deleteChapter(in: { id: $id }) {
      succeeded
    }
  }
`;
export const UPDATE_CHAPTER = gql`
  mutation UpdateChapter($chapterID: String!, $title: String!, $arabicTitle: String!, $description: String!) {
    updateChapter(in: {chapterID: $chapterID, title: $title, arabicTitle: $arabicTitle, description: $description}) {
      chapterID
      title
      arabicTitle
      description
    }
  }
`;
export const UPDATE_TEACHER = gql`
  mutation UpdateTeacher(
    $description: String!
    $teacherID: String!
    $gender: String!
    $dob: String!
    $firstname: String!
    $lastname: String!
    $cityID: Int!
    $avatar: String!
  ) {
    updateTeacher(
      in: {
        description: $description
        teacherID: $teacherID
        gender: $gender
        dateOfBirth: $dob
        firstname: $firstname
        lastname: $lastname
        cityID: $cityID
        avatar: $avatar
      }
    ) {
      teacherID
    }
  }
`;
export const UPDATE_CLASSROOM = gql`
mutation updateClassRoom(
  $classRoomID: String!,
  $title: String!,
  $arabicTitle: String!,
  $description: String!,
  $arabicDescription: String!,
  $price: Int!,
  $image: String!
) {
  updateClassRoom(in: {
    classRoomID: $classRoomID,
    title: $title,
    arabicTitle: $arabicTitle,
    description: $description,
    arabicDescription: $arabicDescription,
    price: $price,
    image: $image
  }) {
    classRoomID,
    title,
    arabicTitle,
    description,
    arabicDescription,
    image,
    price,
    badge,
    studentCount,
    rating,
    teacher {
      teacherID
    },
    chapters {
      chapterID
    }
  }
}

`

export const CREATE_PDF = gql`
  mutation CreatePdf(
    $lessonID: String!
    $title: String!
    $arabicTitle: String!
    $description: String!
    $arabicDescription: String!
    $lectureNumber: Int!
    $url: String!
  ) {
    createPdf(
      in: {
        lessonID: $lessonID
        title: $title
        arabicTitle: $arabicTitle
        description: $description
        arabicDescription: $arabicDescription
        lectureNumber: $lectureNumber
        url: $url
      }
    ) {
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
`;


export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($documentID: String!) {
    deleteDocument(documentID: $documentID) {
      succeeded
    }
  }
`;
