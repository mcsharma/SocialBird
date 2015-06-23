var LoginUtils = (function () {

  this.statusChangeCallback = function (response) {
    if (response.status === 'connected') {
      onLoggedIn(response);
    } else {
      onLoggedOut();
    }
  };

  this.onLoggedOut = function () {
    $('#login').show();
  };

  this.onLoginClick = function () {
    FB.login(statusChangeCallback, {scope: 'manage_pages'});
  };

  this.onLoggedIn = function (response) {
    $('#login').hide();
    React.render(
      <PagesManager userID={response.authResponse.userID} />,
      $('#pages')[0]
    );
  };

  return this;

})();