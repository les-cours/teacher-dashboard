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
// export const UPDATE_CLASSROOM = gql`

// `
