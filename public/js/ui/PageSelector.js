var PageSelector = React.createClass({
  render() {
    var pages = this.props.data.slice();
    pages.unshift({id: 0, name: 'Select a Page'});
    return (
      <select onChange={this.props.onChange} value={this.props.value}>
        {pages.map(function (page) {
          return <option key={page.id} value={page.id}>{page.name}</option>;
        })}
      </select>
    );
  }
});
