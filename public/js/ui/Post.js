var Post = React.createClass({
  render: function() {
    var post = this.props.data;
    ids = post.id.split('_');
    var permalink = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];
    var content = null;
    switch (post.type) {
      case 'video':
        var source_uri = URI(post.source);
        if (source_uri.host() === 'www.youtube.com') {
          source_uri.setQuery("autoplay", 0); // don't auto-play!
          content =
            <iframe width="460" height="270"
              src={source_uri.href()}
              frameborder="0"
              allowfullscreen="true">
            </iframe>;
        } else {
          content =
            <video
              className="video-js vjs-default-skin"
              controls preload="auto"
              width="460" height="270"
              poster={post.full_picture}>
              <source src={post.source} type='video/mp4' />
            </video>;
        }
        break;
      case 'photo':
        content =
          <img width="460" height="270" src={post.full_picture} />;
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
          <div style={{"margin-top":"8px"}}>{post.message}</div>
          <div style={{"margin-top": post.message ? "8px" : "15px"}}>{content}</div>
        </div>
      </div>
    );
  }
});
