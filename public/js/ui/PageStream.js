var PageStream = React.createClass({
  getInitialState: function() {
    return {
      morePosts: [],
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.replaceState(this.getInitialState());
  },

  render: function() {
    if (typeof(this.props.posts) === 'undefined') {
      return <div />;
    }
    var all_posts = this.props.posts.concat(this.state.morePosts);
    var paging_links = this.state.pagingLinks;
    if (!paging_links) {
      paging_links = this.props.pagingLinks;
    }
    var show_more_link = paging_links && paging_links.next;
    return (
      <div>
        {all_posts.map(function (post) {
          return <Post from={this.props.page} key={post.id} data={post}/>;
        }.bind(this))}
        <div style={{"height": "100px", "margin-top": "15px"}}>
          {show_more_link
            ? <a style={{"display":"block"}} href="#" onClick={this.clickedSeeMore}>
                <div
                  style={{ "padding":"5px"}}
                  className="bg-info text-center">
                  See More
                </div>
              </a>
            : null
          }
        </div>
      </div>
    );
  },

  clickedSeeMore: function(event) {
    var paging_links = this.state.pagingLinks;
    if (!paging_links) {
      // this is the first time user is clicking 'See more' link
      // fallback to paging links passed in props
      paging_links = this.props.pagingLinks;
    }
    if (!paging_links || !paging_links.next) {
      return;
    }
    FB.api(paging_links.next, function(response) {
      var more_posts = this.state.morePosts.concat(response.data);
      this.setState({
        morePosts: more_posts,
        pagingLinks: response.paging ? response.paging : {}
      });
    }.bind(this));
    event.preventDefault();
  },
});