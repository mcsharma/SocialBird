var Home = (function() {

  this.main = function() {
    FB.getLoginStatus(LoginUtils.statusChangeCallback);
  }
  return this;

})();
