var Post = React.createClass({
  render() {
    var post = this.props.data;
    ids = post.id.split('_');
    var permalink = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];
    return (
      <div>
        <hr className="separator"/>
        <div style={{"float": "left", "margin-top":"10px"}}>
          <ProfilePhoto of={this.props.from} />
        </div>
        <div style={{"margin-top":"7px", "margin-left":"40px"}}>
          <ProfileLink  of={this.props.from} />
        <a href={permalink} target="_blank" className="post_permalink">
          <DateTime timestamp={post.created_time} />
        </a>
        </div>
        <div>
          <span>{post.type}</span>
          <span>{post.message}</span>
        </div>
      </div>
    );
  }
});
