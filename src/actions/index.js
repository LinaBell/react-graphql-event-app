import { GET_USER } from '../reducers/user'
import { API, graphqlOperation } from 'aws-amplify'
import { getUser } from '../graphql/queries'

export const userActions = {
  getUserInfo,
  updateUserInfo,
}

async function getUserInfo(userId) {
  const result = await API.graphql(graphqlOperation(getUser, { userId }))
  return {
    type: GET_USER,
    payload: result,
  }
}

function updateUserInfo(data) {
  console.log(data.getUser)
  return {
    type: GET_USER,
    payload: data.getUser,
  }
}

export default userActions