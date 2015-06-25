
var PagesManager = React.createClass({

  getPostFieldsToFetch: function() {
    return 'message,created_time,link,type,full_picture,source';
  },

  getInitialState: function() {
    return {};
  },

  handleSelectorChange: function(event) {
    this.setState({
      pageID: event.target.value,
      posts: undefined,
      pagingLinks: undefined
    });
  },

  onPostCreated: function(post_id) {
    FB.api(post_id + '?date_format=U&fields='+this.getPostFieldsToFetch(), function (post) {
      var posts = [];
      if (this.state.posts) {
        posts = this.state.posts.slice();
      }
      // prepend the new post in the existing list
      posts.unshift(post);
      this.setState({
        posts: posts,
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
    if (!this.state.status) {
      FB.getLoginStatus(this.statusChangeCallBack);
      return;
    }

    if (this.state.status !== 'connected') {
      return;
    }

    if (typeof (this.state.manage_pages) === 'undefined') {
      FB.api('/me/permissions', function (response) {
        this.setState({
          status: 'connected',
          manage_pages: this.parsePermissions(response).manage_pages || false
        });
      }.bind(this));
      return;
    }
    if (this.state.manage_pages === false) {
      return;
    }
    if (typeof (this.state.pages) === 'undefined') {
      FB.api(
        '/me?fields=accounts{' +
        'name,cover,access_token,picture.type(small),likes,link' +
        '}',
        function (response) {
          this.setState({
            pages: response.accounts.data,
            pageID: response.accounts.data.length > 0 ? response.accounts.data[0].id : 0
          });
        }.bind(this)
      );
    }

    if (!this.state.pageID) {
      return;
    }
    if (typeof (this.state.posts) === 'undefined') {
      FB.api(
        this.state.pageID + '/posts?date_format=U&limit=2&fields='+this.getPostFieldsToFetch(),
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
    }
  },

  statusChangeCallBack: function (response) {
    this.replaceState({
      status: response.status
    });
  },

  facebookLogin: function () {
    FB.login(this.statusChangeCallBack, {scope: 'manage_pages'});
  },

  spinner: function () {
    return (
      <div className="glyphicon glyphicon-refresh glyphicon-refresh-animate" />
    );
  },

  render: function() {
    if (!this.state.status) {
      return this.spinner();
    }
    if (this.state.status !== 'connected') {
      return (
        <div>
          <button className="btn btn-primary" onClick={this.facebookLogin}>
            Login with Facebook
          </button>
        </div>
      );
    }
    if (typeof (this.state.manage_pages) === 'undefined') {
      return this.spinner();
    }

    if (this.state.manage_pages === false) {
      return (
        <div>
          <button className="btn btn-primary" onClick={this.facebookLogin}>
            Grant Manage Pages
          </button>
        </div>
      );
    }

    if (typeof (this.state.pages) === 'undefined') {
      return this.spinner();
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
          {page ?
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
        <div className="col-md-4" />
      </div>
    );
  }
});
