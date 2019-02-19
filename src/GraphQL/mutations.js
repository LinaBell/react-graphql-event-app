// eslint-disable
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($username: String!, $email: String!) {
  createUser(username: $username, email: $email) {
    id
    username
    email
    events {
      items {
        userId
        id
        name
        where
        when
        description
        isPrivate
      }
      nextToken
    }
  }
}
`;
export const createEvent = `mutation CreateEvent(
  $userId: ID!
  $name: String!
  $when: String!
  $where: String!
  $description: String!
) {
  createEvent(
    userId: $userId
    name: $name
    when: $when
    where: $where
    description: $description
  ) {
    userId
    id
    name
    where
    when
    description
    isPrivate
    comments {
      items {
        eventId
        commentId
        content
        createdAt
      }
      nextToken
    }
  }
}
`;
export const deleteEvent = `mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id) {
    userId
    id
    name
    where
    when
    description
    isPrivate
    comments {
      items {
        eventId
        commentId
        content
        createdAt
      }
      nextToken
    }
  }
}
`;
export const commentOnEvent = `mutation CommentOnEvent($eventId: ID!, $content: String!, $createdAt: String!) {
  commentOnEvent(eventId: $eventId, content: $content, createdAt: $createdAt) {
    eventId
    commentId
    content
    createdAt
  }
}
`;
