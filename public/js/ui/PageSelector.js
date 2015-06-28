var PageSelector = React.createClass({

  onSelectorChange: function(event) {
    var page_id = $(event.target).closest('a').data('value');
    this.props.onPageChange(page_id);
  },

  render: function() {
    var style = {
      width: "200px",
      height: $(window).height(),
      position: "fixed",
      overflow: "auto",
    };
    return (
      <div
        className="list-group page_selector"
        style={style}>
        {this.props.data.map(function(page) {
          var classes = "list-group-item";
          if (page.id == this.props.value) {
            classes += " active";
          }
          return (
            <a
              key={page.id}
              data-value={page.id}
              href="#"
              className={classes}
              onClick={this.onSelectorChange}>
              {page.name}
            </a>
          );
        }.bind(this))}
      </div>
    );
  }
});
