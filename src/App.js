import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'
import { SignIn, SignUp } from 'aws-amplify-react'
import { Authenticator } from "aws-amplify-react/dist/Auth"
import CustomSignIn from './components/SignIn'
import CustomSignUp from './components/SignUp'
import { getUser } from './graphql/queries'

import config from "./aws-config"
import { ApolloProvider } from "react-apollo"
import AWSAppSyncClient from "aws-appsync"
import { Rehydrated } from "aws-appsync-react"
import { connect } from 'react-redux'
import userActions from './actions'

import AllEvents from './components/AllEvents'
import NewEvent from './components/NewEvent'
import ViewEvent from './components/ViewEvent'

import "semantic-ui-css/semantic.min.css"
import 'react-datepicker/dist/react-datepicker.css'
import './styles/App.css'
import './styles/main.css'

class App extends React.Component {
  render() {
    // if(!this.props.user) this.props.getUserInfo()
    if(this.props.authState === "signedIn") {
      return (
        <Router>
          <div>
            <Route exact={true} path="/" component={AllEvents} />
            <Route path="/event/:id" component={ViewEvent} />
            <Route path="/newEvent" component={NewEvent} />
          </div>
        </Router>
      )
    } else {
      return null
    }
  }
}

class AppWithAuth extends React.Component {
  async componentDidMount() {
    const { dispatch } = this.props
    const user = await Auth.currentUserInfo()
    if(!this.props.user.userId) {
      try {
        const result = await API.graphql(graphqlOperation(getUser, { userId: user.attributes.sub }))
        dispatch(userActions.updateUserInfo(result.data))
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    return (
      <div>
        <ApolloProvider client={client}>
          <Rehydrated>
            <Authenticator hide={[SignIn, SignUp]} amplifyConfig={config}>
              <CustomSignIn />
              <CustomSignUp />
              <App />
            </Authenticator>
          </Rehydrated>
        </ApolloProvider>
      </div>
    )
  }
}

Amplify.configure(config)

const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: config.aws_appsync_authenticationType,
    // apiKey: config.aws_appsync_apiKey,
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
  }
})



function mapStateToProps(state) {
  const { user } = state
  return { user }
}
export default connect(mapStateToProps)(AppWithAuth)
