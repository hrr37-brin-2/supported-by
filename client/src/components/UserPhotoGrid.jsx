import React from 'react';
import UserThumbnail from './UserThumbnail.jsx';

class UserPhotoGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="thumbnails">
      {this.props.comments.map(comment => {
        return (
          <UserThumbnail avatar={comment.avatar} user={comment.username}/>
        )
      })}
      </div>
    );
  }
}

export default UserPhotoGrid;