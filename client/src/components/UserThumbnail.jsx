import React from 'react';

class UserThumbnail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a className="thumbnail">
        <span>
          <img src={this.props.avatar} height="100px" width="100px"></img>
          {this.props.user}
        </span>
        <img src={this.props.avatar} height ="26px" width="26px"></img>
      </a>
    );
  }
}

export default UserThumbnail;