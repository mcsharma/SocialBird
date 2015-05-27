var PageInfo = React.createClass({

  getInitialState() {
    return {
      coverPhoto: null
    };
  },

  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    if (!this.props.data.cover || this.state.coverPhoto) {
      return;
    }
    FB.api(
      this.props.data.cover.cover_id + '?fields=images',
      function (response) {
        if (!this.isMounted()) {
          return;
        }
        this.setState({
          coverPhoto: Utils.getPictureOfHeight(response, 130)
        });
      }.bind(this)
    );
  },
  render() {
    var page = this.props.data;
    if (!page) return null;
    return (
      <div>
        <div><img src={this.state.coverPhoto}></img></div>
        <div><img src={page.picture.data.url} alt={page.id}></img></div>
        <div>
          <a href={page.link}>{page.name}</a>
          {page.likes} Total Likes
        </div>
        <a href={page.link}>{page.link}</a>
      </div>
    );
  }
});
