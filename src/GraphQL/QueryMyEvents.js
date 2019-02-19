import gql from "graphql-tag";

export default gql(`
query($userId: ID!) {
  listEventsByUser(userId: $userId) {
    items {
      id
      name
      where
      when
      description
      comments {
        items {
          commentId
        }
      }
    }
  }
}`);
