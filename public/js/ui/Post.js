var Post = React.createClass({
  render() {
    var post = this.props.data;
    ids = post.id.split('_');
    var permalink = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];
    var content = null;
    switch (post.type) {
      case 'video':
        content =
          <video
            id="example_video_1"
            className="video-js vjs-default-skin"
            controls preload="auto"
            width="400" height="240"
            poster={post.full_picture}>
            <source src={post.source} type='video/mp4' />
          </video>;
        break;
      case 'photo':
        content =
          <img width="400" height="240" src={post.full_picture} />;
        break;
    }
    return (
      <div>
        <hr className="separator"/>
        <div style={{"float": "left", "margin-top":"10px"}}>
          <ProfilePhoto of={this.props.from} />
        </div>
        <div style={{"margin-top":"7px", "margin-left":"50px"}}>
          <ProfileLink  of={this.props.from} />
          <a href={permalink} target="_blank" className="post_permalink">
            <DateTime timestamp={post.created_time} />
          </a>
        </div>
        <div>
          <div>{post.message}</div>
          {content}
        </div>
      </div>
    );
  }
});
