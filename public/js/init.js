window.fbAsyncInit = function () {
  FB.init({
    appId: '609246289183992', // development
   // appId: '384055871779958', // production
    xfbml: true,
    version: 'v2.3'
  });
  Home.main();
};
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
