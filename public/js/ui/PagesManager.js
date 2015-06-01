
var PagesManager = React.createClass({

  getInitialState() {
    return {
      pageID: this.props.default ? this.props.default : 0,
      hasPosts: false,
      posts: []
    }
  },

  handleSelectorChange(event) {
    this.setState({
      pageID: event.target.value,
      hasPosts: false,
      posts: []
    });
  },

  onPostCreated(post_id) {
    FB.api(post_id + '?fields=message,created_time,link,type', function (post) {
      var posts = this.state.posts.slice();
      // prepend the new post in the existing list
      posts.unshift(post);
      this.setState({
        pageID: this.state.pageID,
        hasPosts: true,
        posts: posts
      });
    }.bind(this));
  },

  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    if (this.state.pageID == 0 || this.state.hasPosts) {
      return;
    }
    FB.api(
      this.state.pageID + '/posts?fields=message,created_time,link,type',
      function (response) {
        if (!this.isMounted()) {
          return;
        }
        this.setState({
          pageID: this.state.pageID,
          hasPosts: true,
          posts: response.data
        });
      }.bind(this)
    );
  },

  render() {
    var page = Utils.getPageDataForID(this.props.data, this.state.pageID);
    return (
      <div className="row">
        <div className="col-md-4">
          <PageSelector
          onChange={this.handleSelectorChange}
          data={this.props.data}
          value={this.state.pageID}/>
        </div>
        <div className="col-md-4">
          {this.state.pageID !== 0 ?
            <div>
              <PageInfo key={page.id} data={page}/>
              <div className="margin-top-10">
                <PageComposer data={page} onPostCreated={this.onPostCreated}/>
              </div>
              <PageStream posts={this.state.posts}/>
            </div> :
            null
          }
        </div>
        <div className="col-md-4">
        </div>
      </div>
    );
  }
});
