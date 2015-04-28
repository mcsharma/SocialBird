function main() {
  FB.getLoginStatus(statusChangeCallback);
}

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    onLoggedIn();
  } else {
    onLoggedOut();
  }
}

function onLoggedOut() {
  $('#login').show();
}

var onLoginClick = function () {
  FB.login(statusChangeCallback, {scope: 'manage_pages,publish_pages'});
};

function onLoggedIn() {
  $('#login').hide();
  FB.api(
    '/me?fields=name,accounts{' +
    'name,cover,access_token,picture.type(small),likes,link' +
    '}',
    onInitialDataFetched
  );
}

function onInitialDataFetched(response) {
  $('#welcome').text("Welcome " + response.name);
  React.render(
    <PagesManager data={response.accounts.data} />,
    $('#pages')[0]
  );
}


var PagesManager = React.createClass({

  getInitialState() {
    return {
      pageID: this.props.default ? this.props.default : 0,
      hasPosts: false,
      posts: []
    }
  },

  handleSelectorChange(event) {
    this.setState({
      pageID: event.target.value,
      hasPosts: false,
      posts: []
    });
  },

  onPostCreated(post_id) {
    FB.api(post_id + '?fields=message,created_time,link,type', function (post) {
      var posts = this.state.posts.slice();
      // prepend the new post in the existing list
      posts.unshift(post);
      this.setState({
        pageID: this.state.pageID,
        hasPosts: true,
        posts: posts
      });
    }.bind(this));
  },

  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    if (this.state.pageID == 0 || this.state.hasPosts) {
      return;
    }
    FB.api(
      this.state.pageID + '/posts?fields=message,created_time,link,type',
      function (response) {
        if (!this.isMounted()) {
          return;
        }
        this.setState({
          pageID: this.state.pageID,
          hasPosts: true,
          posts: response.data
        });
      }.bind(this)
    );
  },

  render() {
    var page = getPageDataForID(this.props.data, this.state.pageID);
    return (
      <div>
        <PageSelector
          onChange={this.handleSelectorChange}
          data={this.props.data}
          value={this.state.pageID}/>
        {this.state.pageID !== 0 ?
          <div>
            <PageInfo data={page}/>
            <PageComposer data={page} onPostCreated={this.onPostCreated}/>
            <PageStream posts={this.state.posts}/>
          </div> :
          null
        }
      </div>
    );
  }
});

var PageComposer = React.createClass({

  onPostButtonClick() {
    var textarea = this.refs.textarea.getDOMNode();
    var message = textarea.value;
    $(textarea).val('');
    FB.api(
      this.props.data.id + '/feed?message=' + message +
        '&access_token=' + this.props.data.access_token,
      'POST',
      function (response) {
        this.props.onPostCreated(response.id);
      }.bind(this)
    );
  },

  render() {
    return (
      <form>
        <textarea
          ref="textarea"
          className="composer"
          placeholder="Post something on your Page"/>
        <input
          onClick={this.onPostButtonClick}
          type='button'
          value='Post as Your Page'>
        </input>
      </form>
    );
  }
});

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

var PageStream = React.createClass({
  render() {
    return (
      <div>
        {this.props.posts.map(function (post) {
          return <Post key={post.id} data={post}/>;
        })}
      </div>
    );
  }
});

var Post = React.createClass({
  render() {
    var post = this.props.data;
    return (
      <div>
        <span>{post.message}</span>
        {' '} {post.type} {' '}
        <span><a href={post.link}>{post.id}</a></span>
      </div>
    );
  }
});

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

function getPageDataForID(pages, page_id) {
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].id == page_id.toString()) {
      return pages[i];
    }
  }
  return null;
}
