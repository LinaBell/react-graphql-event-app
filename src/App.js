import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Amplify, { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
import awsmobile from "./aws-exports"
import { ApolloProvider } from "react-apollo"
import AWSAppSyncClient from "aws-appsync"
import { Rehydrated } from "aws-appsync-react"

import AllEvents from './Components/AllEvents'
import NewEvent from './Components/NewEvent'
import ViewEvent from './Components/ViewEvent'

import "semantic-ui-css/semantic.min.css"
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'

const Home = () => (
  <div className="ui container">
    <AllEvents />
  </div>
)

const App = () => (
  <Router>
    <div>
      <Route exact={true} path="/" component={Home} />
      <Route path="/event/:id" component={ViewEvent} />
      <Route path="/newEvent" component={NewEvent} />
    </div>
  </Router>
)
const AppWithAuth = withAuthenticator(App, true)

Amplify.configure(awsmobile)

const client = new AWSAppSyncClient({
  url: "https://lha4ppaxqjcgbfyvl4nxqb3nk4.appsync-api.us-west-2.amazonaws.com/graphql",
  region: "us-west-2",
  auth: {
    type: "API_KEY",
    apiKey: "da2-gl27qnwwvfam5odohtzdwkpzee",
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
