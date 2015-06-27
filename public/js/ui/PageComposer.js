var PageComposer = React.createClass({

  getInitialState: function() {
    return {};
  },

  requestPublishPages: function() {
    FB.login(this.statusChangeCallback, {scope: 'publish_pages'});
  },

  statusChangeCallback: function(response) {
    FB.api('/me/permissions', function (response) {
      this.setState({
        publishPages: PagesManager.parsePermissions(response).publish_pages
      });
    }.bind(this));
  },

  onPostButtonClick: function() {
    var composer = this.refs.composer.getDOMNode();
    var message = composer.value;
    $(composer).val('');
    FB.api(
      this.props.data.id + '/feed?message=' + message +
      '&access_token=' + this.props.data.access_token,
      'POST',
      function (response) {
        this.props.onPostCreated(response.id);
      }.bind(this)
    );
  },

  render: function() {
    if (!this.props.publishPages && !this.state.publishPages) {
      return (
        <div className="alert alert-warning" role="alert">
          We need your permission to enable publishing as your pages.
          <div className="text-center" style={{"margin-top":"10px"}}>
            <input
              type='button'
              className="btn btn-primary btn-success"
              value='Grant permission'
              onClick={this.requestPublishPages}
            />
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="form-group">
          <textarea
            ref="composer"
            rows="3"
            className="form-control"
            placeholder="Post something on your Page"
          />
        </div>
        <div className="text-right form-group">
          <input
            onClick={this.onPostButtonClick}
            type='button'
            className="btn btn-primary"
            value='Post'>
          </input>
        </div>
      </div>
    );
  }
});
