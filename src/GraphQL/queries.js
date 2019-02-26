// eslint-disable
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($userId: ID!) {
  getUser(userId: $userId) {
    id
    userId
    username
    firstname
    lastname
    email
  }
}
`;
export const listUsers = `query ListUsers {
  listUsers {
    id
    userId
    username
    firstname
    lastname
    email
  }
}
`;
export const getEvent = `query GetEvent($id: ID!) {
  getEvent(id: $id) {
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
export const listEventsByUser = `query ListEventsByUser($userId: ID!, $limit: Int, $nextToken: String) {
  listEventsByUser(userId: $userId, limit: $limit, nextToken: $nextToken) {
    items {
      userId
      id
      name
      where
      when
      description
      isPrivate
      comments {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const listEventsPublic = `query ListEventsPublic($limit: Int, $nextToken: String) {
  listEventsPublic(limit: $limit, nextToken: $nextToken) {
    items {
      userId
      id
      name
      where
      when
      description
      isPrivate
      comments {
        nextToken
      }
    }
    nextToken
  }
}
`;
