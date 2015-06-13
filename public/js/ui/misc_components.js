var ProfileLink = React.createClass({
  render() {
    var profile = this.props.of;
    return (
      <a href={"https://facebook.com/"+profile.id} target="_blank">{profile.name}</a>
    );
  }
});

var ProfilePhoto = React.createClass({
  render() {
    var page = this.props.of;
    return (
      <img width="30" height="30" src={page.picture.data.url} alt={page.id} ></img>
    );
  }
});

var DateTime = React.createClass({
  render() {
    var date = new Date(this.props.timestamp * 1000);
    var month_names = [
      "Jan", "Feb", "March", "April",
      "May", "June", "July", "Aug",
      "Sept", "Oct", "Nov", "Dec"
    ];
    var month_name = month_names[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var am_pm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var str_time = hours + ':' + minutes + am_pm;
    return (
      <div>{month_name+' '+day+' at '+str_time}</div>
    );
  }
});
