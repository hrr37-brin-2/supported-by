import React from 'react';

class Comment extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="commentBlock">
        <div className="pic">
          <img src={this.props.comment.avatar} height="28" width="28"></img>
        </div>
        <div className="words comment">
          <a className="username" href="">{this.props.comment.username}</a>
          {this.props.comment.text}
        </div>
      </div>
    );
  }
}

export default Comment;
