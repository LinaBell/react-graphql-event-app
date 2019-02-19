import gql from "graphql-tag";

export default gql(`
mutation($userId: ID! $name: String! $when: String! $where: String! $description: String!) {
  createEvent(
    userId: $userId
    name: $name
    when: $when
    where: $where
    description: $description
  ) {
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
}`);
