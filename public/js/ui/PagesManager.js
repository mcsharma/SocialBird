
var PagesManager = React.createClass({

  getPostFieldsToFetch: function() {
    return 'message,created_time,link,type,full_picture,source';
  },

  getInitialState: function() {
    return {
      perms: {'status': 'unknown', granted: {}},
      pages: [],
      pageID: 0,
      hasPosts: false,
      posts: [],
      pagingLinks: {},
    };
  },

  handleSelectorChange: function(event) {
    this.setState({
      pageID: event.target.value,
      pages: this.state.pages,
      perms: this.state.perms,
      hasPosts: false,
      posts: [],
      pagingLinks: {},
    });
  },

  onPostCreated: function(post_id) {
    FB.api(post_id + '?date_format=U&fields='+this.getPostFieldsToFetch(), function (post) {
      var posts = this.state.posts.slice();
      // prepend the new post in the existing list
      posts.unshift(post);
      this.setState({
        pageID: this.state.pageID,
        hasPosts: true,
        posts: posts,
        pagingLinks: this.state.pagingLinks
      });
    }.bind(this));
  },

  componentDidMount: function() {
    this.componentDidUpdate();
  },

  parsePermissions: function (response) {
    var ret = {};
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].permission === 'manage_pages' &&
          response.data[i].status === 'granted') {
        ret.manage_pages = true;
      }
      if (response.data[i].permission === 'manage_pages' &&
          response.data[i].status === 'granted') {
        ret.publish_pages = true;
      }
    }
    return ret;
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getInitialState());
  },

  componentDidUpdate: function() {
    if (this.state.perms.status === 'unknown') {
      FB.api('/me/permissions', function (response) {
        this.setState({
          perms: {status: 'known', granted: this.parsePermissions(response)}
        });
      }.bind(this));
      return;
    }
    if (!this.state.perms.granted.manage_pages) {
      return;
    }
    if (!this.state.pages.length) {
    FB.api(
      '/me?fields=accounts{' +
      'name,cover,access_token,picture.type(small),likes,link' +
      '}',
      function (response) {
        this.setState({
          pageID: 0,
          pages: response.accounts.data,
          perms: this.state.perms,
          hasPosts: false,
          posts: [],
          pagingLinks: {},
        });
      }.bind(this)
    );
    }

    if (this.state.pageID === 0 || this.state.hasPosts) {
      return;
    }
    FB.api(
      this.state.pageID + '/posts?date_format=U&limit=2&fields='+this.getPostFieldsToFetch(),
      function (response) {
        if (!this.isMounted()) {
          return;
        }
        this.setState({
          pageID: this.state.pageID,
          pages: this.state.pages,
          perms: this.state.perms,
          hasPosts: true,
          posts: response.data,
          pagingLinks: response.paging
        });
      }.bind(this)
    );
  },
  requestManagePages: function () {
    FB.login(LoginUtils.statusChangeCallback, {scope: 'manage_pages'});
  },
  render: function() {
    if (this.state.perms.status === 'unknown') {
      return (
        <div>Fetching status..</div>
      );
    }
    if (!this.state.perms.granted.manage_pages) {
      return (
      <button className="btn btn-primary" onClick={this.requestManagePages}>
       Grant Manage Pages
      </button>
      );
    }
    if (!this.state.pages.length) {
      return (
        <div>Fetching Pages...</div>
      );
    }
    var page = Utils.getPageDataForID(this.state.pages, this.state.pageID);
    return (
      <div className="row">
        <div className="col-md-4">
          <PageSelector
          onChange={this.handleSelectorChange}
          data={this.state.pages}
          value={this.state.pageID}/>
        </div>
        <div className="col-md-4">
          {this.state.pageID !== 0 ?
            <div>
              <PageInfo key={page.id} data={page}/>
              <div className="margin-top-10">
                <PageComposer data={page} onPostCreated={this.onPostCreated}/>
              </div>
              <PageStream page={page} posts={this.state.posts} pagingLinks={this.state.pagingLinks}/>
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
