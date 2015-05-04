var PageStream = React.createClass({
  render() {
    return (
      <div>
        {this.props.posts.map(function (post) {
          return <Post key={post.id} data={post}/>;
        })}
      </div>
    );
  }
});