import React, { Component } from "react";
// import { graphql } from "react-apollo";
import moment from 'moment';
// import { getEvent } from "../graphql/queries"
// import { subscribeToEventComments } from "../graphql/subscriptions";
import NewComment from "./NewComment";

// TODO: Add subscription

class EventComments extends Component {

    subscription;

    componentDidMount() {
        this.subscription = this.props.subscribeToEventComments();
    }

    componentWillUnmount() {
        this.subscription();
    }

    renderComment = (comment) => {
        return (
            <div className="comment" key={comment.commentId}>
                <div className="avatar"><i className="icon user circular"></i></div>
                <div className="content">
                    <div className="text">
                        {comment.content}
                    </div>
                    <div className="metadata">{moment(comment.createdAt).format('LL, LT')}</div>
                </div>
            </div>
        );
    }

    render() {
        const { comments: { items }, eventId } = this.props;

        return (
            <div className="ui items">
                <div className="item">
                    <div className="ui comments">
                        <h4 className="ui dividing header">Comments</h4>
                        {[].concat(items).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderComment)}
                        <NewComment eventId={eventId} />
                    </div>
                </div>
            </div>
        );
    }

}

export default EventComments;