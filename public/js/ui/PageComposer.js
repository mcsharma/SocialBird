var PageComposer = React.createClass({

  onPostButtonClick() {
    var textarea = this.refs.textarea.getDOMNode();
    var message = textarea.value;
    $(textarea).val('');
    FB.api(
      this.props.data.id + '/feed?message=' + message +
      '&access_token=' + this.props.data.access_token,
      'POST',
      function (response) {
        this.props.onPostCreated(response.id);
      }.bind(this)
    );
  },

  render() {
    return (
      <form>
        <textarea
          ref="textarea"
          className="composer"
          placeholder="Post something on your Page"/>
        <input
          onClick={this.onPostButtonClick}
          type='button'
          value='Post as Your Page'>
        </input>
      </form>
    );
  }
});
