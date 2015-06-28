var ProfileLink = React.createClass({
  render: function() {
    var profile = this.props.of;
    return (
      <a href={"https://www.facebook.com/"+profile.id} target="_blank">{profile.name}</a>
    );
  }
});

var ProfilePhoto = React.createClass({
  render: function() {
    var page = this.props.of;
    return (
      <img width="40" height="40" className="img-rounded" src={page.picture.data.url} alt={page.id} />
    );
  }
});

var DateTime = React.createClass({
  render: function() {
    var date = new Date(this.props.timestamp * 1000);
    var month_names = [
      "Jan", "Feb", "March", "April",
      "May", "June", "July", "Aug",
      "Sept", "Oct", "Nov", "Dec"
    ];
    var day_names = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
    var month_name = month_names[date.getMonth()];
    var day_name = day_names[date.getDay()];
    var day = date.getDate();
    var hours = date.getHours();
    var am_pm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var str_time = hours + ':' + minutes + am_pm;
    // If the timestamp belongs to the previous year, then show year instead of time.
    var show_year = (new Date()).getFullYear() > date.getFullYear();
    var text = month_name + ' ' + day + ' at ' + str_time;
    if (show_year) {
      text = month_name + ' ' + day + ', ' + date.getFullYear();
    }
    var full_description =
      day_name + ', ' + month_name + ' ' + day + ', ' +
      date.getFullYear() + ' at ' + str_time;
    return (
      <div title={full_description}>{text}</div>
    );
  }
});
