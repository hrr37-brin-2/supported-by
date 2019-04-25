import React from 'react';
import Comment from './Comment.jsx';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfComments: 3
    };

    this.onShowMore = this.onShowMore.bind(this);
  }

  onShowMore() {
    this.setState({
      numberOfComments: this.state.numberOfComments + 3
    });
  }

  render () {
    return (
      <div>
        <p className="supportedBy">supported by</p>
        {this.props.comments.slice(0, this.state.numberOfComments).map(comment => {
          return (
            <Comment comment={comment}/>
          );
        })}
        {(this.state.numberOfComments <= this.props.comments.length) && <p onClick={() => this.onShowMore()} className="more">more...</p>}
      </div>
    );
  }
}

export default CommentList;
