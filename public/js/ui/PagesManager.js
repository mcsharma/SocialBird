
var PagesManager = React.createClass({

  getInitialState: function() {
    return {};
  },

  handleSelectorChange: function(event) {
    this.setState({
      pageID: $(event.target).closest('li').data('value'),
    });
  },

  onPostCreated: function() {
    this.forceUpdate();
  },

  componentDidMount: function() {
    this.componentDidUpdate();
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
        var perms = Utils.parsePermissions(response);
        this.setState({
          status: 'connected',
          manage_pages: perms.manage_pages || false,
          publish_pages: perms.publish_pages || false
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
        'name,cover,access_token,picture.type(small),likes,link,perms' +
        '}',
        function (response) {
          this.setState({
            pages: response.accounts.data,
            pageID: response.accounts.data.length > 0 ? response.accounts.data[0].id : 0
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

  render: function() {
    if (!this.state.status) {
      return Utils.spinner();
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
      return Utils.spinner();
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
      return Utils.spinner();
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
                <PageComposer data={page} publishPages={this.state.publish_pages} onPostCreated={this.onPostCreated}/>
              </div>
              <hr className="separator"/>
              <PageStream page={page} />
            </div> :
            null
          }
        </div>
        <div className="col-md-4" />
      </div>
    );
  }
});
