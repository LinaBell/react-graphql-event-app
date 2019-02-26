import React from "react"
import { SignUp } from "aws-amplify-react"
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { createUser } from '../graphql/mutations'

export class CustomSignUp extends SignUp {
  constructor(props) {
    super(props)
    this._validAuthStates = ["signUp"]
    this.signUp = this.signUp.bind(this)
    this.createUser = this.createUser.bind(this)
    this.state = {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      error: ''
    }
  }

  onChange = (key, value) => {
    this.setState({ [key]: value })
  }

  signUp = () => {
    const self = this
    const { username, password, email } = this.state

    Auth.signUp({
      username,
      password,
      attributes: {
        email
      }
    })
    .then(res => {
      console.log(res)
      self.setState({ error: '' })
      this.createUser(res.userSub)
    })
    .catch(err => {
      console.log(err)
      self.setState({ error: err.message })
    })

    // const info = await Auth.currentUserInfo()
    // console.log('Returned info: ', info)
  }

  async createUser(sub) {
    console.log(this.state)
    try {
      const result = await API.graphql(graphqlOperation(createUser, {
        userId: sub,
        username: this.state.username,
        email: this.state.email,
        firstname: 'test',
        lastname: 'test',
      }))
      console.log('createUser: result = ', result)
      // this.setState({
      //   user: result.data.getUser
      //   })
    } catch (err) {
      console.log(err)
    }
  }

  showComponent() {
    return (
      <div className="mx-auto w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              key="username"
              name="username"
              onChange={evt => this.onChange('username', evt.target.value)}
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              key="email"
              name="email"
              onChange={evt => this.onChange('email', evt.target.value)}
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              key="password"
              name="password"
              type="password"
              onChange={evt => this.onChange('password', evt.target.value)}
              placeholder="***********"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={this.signUp}
            >
              Sign Up
            </button>
            <p className="text-grey-dark text-xs">
              Have an Account?{" "}
              <a
                className="text-indigo cursor-pointer hover:text-indigo-darker"
                onClick={() => super.changeState("signIn")}
              >
                Login
              </a>
            </p>
          </div>
        </form>
        <div className="text-red text-xs pt-10">
          {this.state.error}
        </div>
      </div>
    )
  }
}

export default CustomSignUp