import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Amplify, { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
// import awsmobile from "./aws-exports"
import config from "./aws-config"
import { ApolloProvider } from "react-apollo"
import AWSAppSyncClient from "aws-appsync"
import { Rehydrated } from "aws-appsync-react"

import AllEvents from './components/AllEvents'
import NewEvent from './components/NewEvent'
import ViewEvent from './components/ViewEvent'

import "semantic-ui-css/semantic.min.css"
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'

const Home = () => (
  <div className="ui container">
    <AllEvents />
  </div>
)
class App extends React.Component {
  state = {
    info: {}
  }

  async componentDidMount() {
    const info = await Auth.currentUserInfo()
    console.log('Returned info: ', info)
    this.setState({ info })
  }

  render() {
    return(
      <Router>
        <div>
          <Route exact={true} path="/" component={Home} props={this.state.info} />
          <Route path="/event/:id" component={ViewEvent} props={this.state.info} />
          <Route path="/newEvent" component={NewEvent} props={this.state.info} />
        </div>
      </Router>
    )
  }
}
const AppWithAuth = withAuthenticator(App, true)

Amplify.configure(config)

const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: config.aws_appsync_authenticationType,
    apiKey: config.aws_appsync_apiKey,
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
  }
})

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
)

export default WithProvider
