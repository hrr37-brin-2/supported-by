import React from 'react';
import CommentList from './CommentList.jsx';
import UserPhotoGrid from './UserPhotoGrid.jsx';

class SupportSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: []
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let endpoint = window.location.pathname;

    if (endpoint.length === 1) {
      endpoint = "/1";
    }

    fetch(`/support${endpoint}`)
    .then(response => {
      return response.json();
    })
    .then(albumData => {
      console.log(albumData);
      this.setState({
        comments: albumData.rows[0].data.comments
      });
    });
  }

  render() {
    return (
      <div className="supportSection">
        <CommentList comments={this.state.comments}/>
        <UserPhotoGrid comments={this.state.comments}/>
      </div>
    );
  }
}

export default SupportSection;
