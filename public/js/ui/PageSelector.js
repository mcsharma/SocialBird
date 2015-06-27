var PageSelector = React.createClass({
  render: function() {
    var pages = this.props.data;
    var selector_text = 'Select a Page';
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id == this.props.value) {
        selector_text = pages[i].name;
      }
    }
    return (
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
          {selector_text}
          <span style={{"margin-left":"5px"}} className="caret" />
        </button>
        <ul className="dropdown-menu">
          {pages.map(function(page) {
            return (
              <li key={page.id} data-value={page.id} onClick={this.props.onChange}>
                <a href="#" style={{"font-weight" : (page.id == this.props.value ? "bold" : "normal")}}>
                  {page.name}
                  {page.id == this.props.value
                    ? <span style={{"margin-left":"5px"}} className="glyphicon glyphicon-ok" />
                    : null
                  }
                </a>
              </li>
            );
          }.bind(this))}
        </ul>
      </div>
    );
  }
});
