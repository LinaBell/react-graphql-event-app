import React, { Component } from "react"
import { Link } from "react-router-dom"
import { API, graphqlOperation } from 'aws-amplify'
import moment from "moment"
import QueryGetUser from "../GraphQL/QueryGetUser"
import QueryAllEvents from "../GraphQL/QueryAllEvents"
import MutationDeleteEvent from "../GraphQL/MutationDeleteEvent"
import QueryMyEvents from "../GraphQL/QueryMyEvents"

class AllEvents extends Component {
    state = {
        busy: false,
        user: {},
        events: []
    }

    static defaultProps = {
        events: [],
        deleteEvent: () => null,
    }

    async componentWillMount() {
        try {
            const result1 = await API.graphql(graphqlOperation(QueryGetUser, { id: '0b6a50aa-6451-4db9-a90e-0ef03ff94e62' }))
            console.log('componentWillMount: result1 = ', result1)

            const result2 = await API.graphql(graphqlOperation(QueryMyEvents, { userId: '0b6a50aa-6451-4db9-a90e-0ef03ff94e62' }))
            console.log('componentWillMount: result2 = ', result2)
            this.setState({
                user: result1.data.getUser,
                events: result2.data.listEventsByUser.items
            })
        } catch (err) {
            console.log(err)
            // this.setState({ loading: false, errors: [ err.message ] })
        }
    }

    async handleDeleteClick(event, e) {
        e.preventDefault()

        if (window.confirm(`Are you sure you want to delete event ${event.id}`)) {
            await API.graphql(graphqlOperation(MutationDeleteEvent, { id: event.id }))
        }
    }

    handleSync = async () => {
        const { client } = this.props
        const query = QueryAllEvents

        this.setState({ busy: true })

        await client.query({
            query,
            fetchPolicy: 'network-only',
        })

        this.setState({ busy: false })
    }

    renderEvent = (event) => (
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
                <i className="icon comment"></i> {event.comments.items.length} comments
            </div>
            <button className="ui bottom attached button" onClick={this.handleDeleteClick.bind(this, event)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    )

    render() {
        const { user, busy, events } = this.state

        return (
            <div>
                <div className="ui clearing basic segment">
                    <h1 className="ui header left floated">{user.username}'s Events</h1>
                    <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
                        <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                        Sync with Server
                    </button>
                </div>
                <div className="ui link cards">
                    <div className="card blue">
                        <Link to="/newEvent" className="new-event content center aligned">
                            <i className="icon add massive"></i>
                            <p>Create new event</p>
                        </Link>
                    </div>
                    {[].concat(events).sort((a, b) => a.when.localeCompare(b.when)).map(this.renderEvent)}
                </div>
            </div>
        )
    }

}

export default AllEvents
