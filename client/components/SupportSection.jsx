import React from 'react';
import CommentList from './CommentList.jsx';
import UserTable from './UserTable.jsx';
import $ from 'jquery';

class SupportSection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    $.ajax({
      method: "GET",
      url: "/:id",
      data: data,
      success: this.setState({
        users: JSON.parse(data)
      })
    });
  }

  render() {
    return (
      <div>
        <CommentList />
        <UserTable />
      </div>
    )
  }
}

export default SupportSection;