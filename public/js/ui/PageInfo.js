var PageInfo = React.createClass({
  render() {
    var page = this.props.data;
    if (!page) return null;
    return (
      <div>
        <div>
          <a href={page.link}>{page.name}</a>
          {page.likes} Total Likes
        </div>
        <a href={page.link}>{page.link}</a>

        <div><img src={page.picture.data.url} alt={page.id}></img></div>
      </div>
    );
  }
});
