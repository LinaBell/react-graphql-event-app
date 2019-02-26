export const GET_USER = 'GET_USER'

// const initialState = {user: {}}
// export default (state = initialState, action) => {
//   console.log('GET_USER reducer', action.payload)
//   switch (action.type) {
//   case GET_USER:
//     return {user: action.payload}
//   default:
//     return state
//   }
// }

export default function user(state = {}, action) {
  switch (action.type) {
    case GET_USER:
      return {user: action.payload}
    default:
      return state
  }
}