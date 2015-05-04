var Post = React.createClass({
  render() {
    var post = this.props.data;
    return (
      <div>
        <span>{post.message}</span>
        {' '} {post.type} {' '}
        <span><a href={post.link}>{post.id}</a></span>
      </div>
    );
  }
});
