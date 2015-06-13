var PageStream = React.createClass({
  render() {
    return (
      <div>
        {this.props.posts.map(function (post) {
          return <Post from={this.props.page} key={post.id} data={post}/>;
        }.bind(this))}
      </div>
    );
  }
});