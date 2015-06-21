var PageInfo = React.createClass({

  getInitialState: function() {
    return {
      coverPhoto: null
    };
  },

  componentDidMount: function() {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
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
  render: function() {
    var page = this.props.data;
    if (!page) return null;
    return (
      <div className="row">
        <div className="col-md-3">
          <img src={page.picture.data.url} alt={page.id} className="img-thumbnail"></img>
        </div>
        <div className="col-md-9">
          <div className="row">
            <a href={page.link}>{page.link}</a>
          </div>
          <div className="row margin-top-10">
            <a href={page.link}>{page.name}</a>
            <span className="margin-left-10">
              <strong>{page.likes}</strong> Likes
            </span>
          </div>
        </div>
      </div>
    );
  }
});
