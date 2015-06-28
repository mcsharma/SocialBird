var PageStream = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  getPostFieldsToFetch: function() {
    return 'message,created_time,link,type,full_picture,source';
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.page.id == this.props.page.id) {
      this.setState({needRefresh: true});
    } else {
      this.replaceState(this.getInitialState());
    }
  },

  componentDidMount: function () {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
    if (typeof (this.state.posts) !== 'undefined' & !this.state.needRefresh) {
      return;
    }
    var since = 0;
    if (this.state.posts) {
      since = this.state.posts[0].created_time;
    }
    FB.api(
      this.props.page.id +
        '/posts?date_format=U&since=' + since +
        '&limit=10&fields=' + this.getPostFieldsToFetch(),
      function (response) {
        if (!this.isMounted()) {
          return;
        }
        // If this is the first time we are fetching posts, then just
        // set everything from response, otherwise just prepend the newly
        // fetched posts into the existing posts.
        if (typeof (this.state.posts) === 'undefined') {
          this.setState({
            posts: response.data,
            pagingLinks: response.paging,
            needRefresh: false,
          });
        } else {
          this.setState({
            posts: response.data.concat(this.state.posts),
            needRefresh: false
          });
        }
      }.bind(this)
    );
    return;
  },

  render: function() {
    if (typeof(this.state.posts) === 'undefined') {
      return (
        <div className="text-center">
          {Utils.spinner()}
        </div>
      );
    }
    var show_more_link = this.state.pagingLinks && this.state.pagingLinks.next;
    return (
      <div>
        {!this.state.posts.length ? <h2 className="gray_text text-center">No Posts to show</h2> : null}
        {this.state.posts.map(function (post) {
          return <Post from={this.props.page} key={post.id} data={post} />;
        }.bind(this))}
        <div style={{"height": "100px"}}>
          {show_more_link
            ? <a style={{"display":"block"}} href="#" onClick={this.clickedSeeMore}>
                <div
                  style={{"padding":"5px"}}
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
    if (!this.state.pagingLinks || !this.state.pagingLinks.next) {
      return;
    }
    FB.api(this.state.pagingLinks.next, function(response) {
      var posts = this.state.posts.concat(response.data);
      this.setState({
        posts: posts,
        pagingLinks: response.paging
      });
    }.bind(this));
    event.preventDefault();
  },
});