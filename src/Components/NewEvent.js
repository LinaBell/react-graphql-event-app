import React, { Component } from "react"
import { Link } from "react-router-dom"
import { API, graphqlOperation } from 'aws-amplify'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { nearest15min } from "../Utils"
import DateTimePickerCustomInput from "./DateTimePickerCustomInput"
import { getUser } from "../graphql/queries"
import { createEvent } from "../graphql/mutations"

class NewEvent extends Component {
  state = {
    user: {},
    event: {
      name: '',
      when: nearest15min().format(),
      where: '',
      description: '',
    }
  }

  async componentWillMount() {
      try {
          const result1 = await API.graphql(graphqlOperation(getUser, { id: '0b6a50aa-6451-4db9-a90e-0ef03ff94e62' }))
          console.log('componentWillMount: result1 = ', result1)
          this.setState({
            user: result1.data.getUser
           })
      } catch (err) {
          console.log(err)
      }
  }

  handleChange(field, { target: { value } }) {
    const { event } = this.state

    event[field] = value

    this.setState({ event })
  }

  handleDateChange(field, value) {
    this.handleChange(field, { target: { value: value.format() } })
  }

  handleSave = async (e) => {
    e.stopPropagation()
    e.preventDefault()

    await API.graphql(graphqlOperation(createEvent, { userId: this.state.user.id, ...this.state.event }))

    this.props.history.push('/')
  }

  render() {
    const { event } = this.state

    return (
      <div className="ui container raised very padded segment">
        <h1 className="ui header">Create an event</h1>
        <div className="ui form">
          <div className="field required eight wide">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={event.name} onChange={this.handleChange.bind(this, 'name')} />
          </div>
          <div className="field required eight wide">
              <label htmlFor="when">When</label>
              <DatePicker
                  className="ui container"
                  customInput={<DateTimePickerCustomInput />}
                  id="when"
                  selected={moment(event.when)}
                  onChange={this.handleDateChange.bind(this, 'when')}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  showTimeSelect
                  timeFormat="hh:mm a"
                  timeIntervals={15}
                  dateFormat="LL LT"
              />
          </div>
          <div className="field required eight wide">
              <label htmlFor="where">Where</label>
              <input type="text" id="where" value={event.where} onChange={this.handleChange.bind(this, 'where')} />
          </div>
          <div className="field required eight wide">
              <label htmlFor="description">Description</label>
              <textarea name="description" id="description" rows="10" value={event.description}
                  onChange={this.handleChange.bind(this, 'description')}></textarea>
          </div>
          <div className="ui buttons">
              <Link to="/" className="ui button">Cancel</Link>
              <div className="or"></div>
              <button className="ui positive button" onClick={this.handleSave}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

export default NewEvent
