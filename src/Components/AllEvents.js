import React, { Component } from "react"
import { Link } from "react-router-dom"
import { API, graphqlOperation } from 'aws-amplify'
import { connect } from 'react-redux'
import moment from "moment"
import { listEventsByUser, listEventsPublic } from "../graphql/queries"
import { createEvent } from "../graphql/mutations"
import { deleteEvent } from "../graphql/mutations"

class AllEvents extends Component {
  constructor(props) {
    super(props)
    this.toggleEvents = this.toggleEvents.bind(this)
    this.getEvents = this.getEvents.bind(this)
    this.handleCopyClick = this.handleCopyClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.getPublicEvents = this.getPublicEvents.bind(this)
    this.state = {
      loading: this.props.user ? false : true,
      events: [],
      error: '',
      displayPublic: false
    }
  }

  componentDidMount() {
    this.getEvents()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.user !== this.props.user) {
      this.getEvents()
    }
  }

  getEvents = async () => {
    if(this.props.user) {
      this.setState({ loading: true })
      try {
        const result = await API.graphql(graphqlOperation(listEventsByUser, { userId: this.props.user.id }))
        this.setState({
          events: result.data.listEventsByUser.items,
          displayPublic: false,
          loading: false,
          error: ''
        })
      } catch (err) {
        console.log(err)
        this.setState({
          loading: false,
          error: 'We\'re having trouble finding your events. Please try back later'
        })
      }
    }
  }

  handleCopyClick = async (event, e) => {
    e.preventDefault()
    let dupEvent = event
    dupEvent.isPrivate = true
    this.setState({ loading: true })
    await API.graphql(graphqlOperation(createEvent, { userId: this.props.user.id, dupEvent }))
    this.getEvents()
  }

  handleDeleteClick = async (event, e) => {
    e.preventDefault()
    if (window.confirm(`Are you sure you want to delete event ${event.id}`)) {
      this.setState({ loading: true })
      await API.graphql(graphqlOperation(deleteEvent, { id: event.id }))
      this.getEvents()
    }
  }

  getPublicEvents = async () => {
    try {
      const result = await API.graphql(graphqlOperation(listEventsPublic))
      this.setState({
        events: result.data.listEventsPublic.items,
        displayPublic: true,
        loading: false,
        error: ''
      })
    } catch (err) {
      console.log(err)
      this.setState({
        loading: false,
        error: 'We\'re having trouble finding public events. Please try back later'
      })
    }
  }

  toggleEvents() {
    if(this.state.displayPublic) this.getEvents()
    else this.getPublicEvents()
  }

  renderEvent = (event) => {
    const copyBtnStyle = event.userId === this.props.user.id ? {display: 'none'} : {width: '50%', display: 'inline'}
    const deleteBtnStyle = event.userId === this.props.user.id ? {width: '100%'} : {width: '50%', display: 'inline'}
    return(
      <Link to={`/event/${event.id}`} className="card" key={event.id}>
          <div className="content">
              <div className="header">{event.name}</div>
          </div>
          <div className="content">
              <p><i className="icon calendar"></i>{moment(event.when).format('LL')}</p>
              <p><i className="icon clock"></i>{moment(event.when).format('LT')}</p>
              <p><i className="icon marker"></i>{event.where}</p>
          </div>
          <div className="content">
              <div className="description"><i className="icon info circle"></i>{event.description}</div>
          </div>
          <div className="extra content">
              <i className="icon comment"></i> {event.comments.items ? event.comments.items.length : 0} comments
          </div>
          <div>
            <button className="ui bottom attached button" style={copyBtnStyle} onClick={() => this.handleCopyClick(event)}>
                <i className="copy icon"></i>
                Copy
            </button>
            <button className="ui bottom attached button" style={deleteBtnStyle} onClick={() => this.handleDeleteClick(event)}>
                <i className="trash icon"></i>
                Delete
            </button>
          </div>
      </Link>
    )
  }

  render() {
    const { loading, events, displayPublic, error } = this.state
    const { user } = this.props

    return (
      <div>
        {loading ?
          <div className="content center pad-box-lg">
            <i aria-hidden="true" className="refresh icon loading massive"></i>
          </div>
          :
          <div>
            <div className="ui clearing basic segment">
                <h1 className="ui header left floated">{user.firstname}'s Events</h1>
                <button className="ui icon right floated basic button" onClick={() => this.toggleEvents()} disabled={loading}>
                    {displayPublic ? 'View My Events' : 'View Public Events'}
                    &nbsp;&nbsp;
                    <i aria-hidden="true" className={`refresh icon ${loading && "loading"}`}></i>
                </button>
            </div>
            <div className="ui link cards pad-l-md pad-r-md">
                <div className="card blue">
                    <Link to="/NewEvent" className="new-event content center aligned">
                        <i className="icon add massive"></i>
                        <p>Create new event</p>
                    </Link>
                </div>
                {[].concat(events).sort((a, b) => a.when.localeCompare(b.when)).map(this.renderEvent)}
                {error}
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user } = state.user
  return {
    user
  }
}
export default connect(mapStateToProps)(AllEvents)