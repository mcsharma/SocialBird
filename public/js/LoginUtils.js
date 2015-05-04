var LoginUtils = (function () {

  this.statusChangeCallback = function (response) {
    if (response.status === 'connected') {
      onLoggedIn();
    } else {
      onLoggedOut();
    }
  };

  this.onLoggedOut = function () {
    $('#login').show();
  };

  this.onLoginClick = function () {
    alert("yoo");
    FB.login(statusChangeCallback, {scope: 'manage_pages,publish_pages'});
  };

  this.onLoggedIn = function () {
    $('#login').hide();
    FB.api(
      '/me?fields=name,accounts{' +
      'name,cover,access_token,picture.type(small),likes,link' +
      '}',
      onInitialDataFetched
    );
  };

  var onInitialDataFetched = function (response) {
    $('#welcome').text("Welcome " + response.name);
    React.render(
      <PagesManager data={response.accounts.data}/>,
      $('#pages')[0]
    );
  };

  return this;

})();