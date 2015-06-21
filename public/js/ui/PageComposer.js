var PageComposer = React.createClass({

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
