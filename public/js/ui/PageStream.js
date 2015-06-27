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
      return;
    }
    this.replaceState(this.getInitialState());
  },

  componentDidMount: function () {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
    if (typeof (this.state.posts) === 'undefined') {
      FB.api(
        this.props.page.id + '/posts?date_format=U&limit=2&fields='+this.getPostFieldsToFetch(),
        function (response) {
          if (!this.isMounted()) {
            return;
          }
          this.setState({
            posts: response.data,
            pagingLinks: response.paging
          });
        }.bind(this)
      );
      return;
    }
  },

  render: function() {
    if (typeof(this.state.posts) === 'undefined') {
      return PagesManager.spinner();
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