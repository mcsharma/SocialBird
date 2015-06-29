var PageStream = React.createClass({
  getInitialState: function() {
    return {
      requiredCount: 10,
    };
  },

  statics: {
    getPostFieldsToFetch: function() {
      return [
        'message',
        'created_time',
        'link',
        'type',
        'full_picture',
        'source',
      ];
    }
  },

  getStreamQuery: function (since) {
    var uri = new URI()
      .segment(this.props.page.id)
      .segment('posts')
      .setQuery('limit', 10)
      .setQuery('date_format', 'U')
      .setQuery('fields', PageStream.getPostFieldsToFetch().join(','));

    if (!isNaN(since)) {
      uri.setQuery('since', since);
    }
    return uri.resource(); // returns (path + query string)
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.page.id == this.props.page.id) {
      this.setState({needRefresh: true});
    } else {
      this.replaceState(this.getInitialState());
    }
  },

  componentDidMount: function () {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
    if (typeof (this.state.posts) === 'undefined') {
      FB.api(
        this.getStreamQuery(),
        function (response) {
          this.setState({
            posts: response.data,
            next: response.paging ? response.paging.next : null,
          });
        }.bind(this)
      );
      return;
    }

    if (this.state.needRefresh) {
      var since = this.state.posts.length
        ? this.state.posts[0].created_time
        : 0;
      FB.api(
       this.getStreamQuery(since),
       function (response) {
          this.setState({
            posts: response.data.concat(this.state.posts),
            // TODO: Might want to improve this count
            requiredCount: this.state.requiredCount + response.data.length,
            needRefresh: false
          });
        }.bind(this)
      );
      return;
    }

    // We want to fetch at least 10 posts in advance
    if (this.state.next && this.state.posts.length < this.state.requiredCount + 10) {
      // TODO: Make sure we make the count equal
      FB.api(this.state.next, function(response) {
        var posts = this.state.posts.concat(response.data);
        this.setState({
          posts: posts,
          next: response.paging ? response.paging.next : null,
        });
      }.bind(this));
    }
  },

  render: function() {
    var posts_section = null;
     if (typeof (this.state.posts) === 'undefined') {
       return (
         <div className="text-center">
           {Utils.spinner()}
         </div>
       );
     }
     // This page is totally empty.
     if (this.state.posts.length === 0) {
       return (
         <h2 className="gray_text text-center">
           No Posts to show
         </h2>
       );
     }
     var posts_section = this.state.posts
       .slice(0, this.state.requiredCount)
       .map(
         function (post) {
           return <Post from={this.props.page} key={post.id} data={post} />;
         }.bind(this)
       );
     var footer = null;
     if (this.state.requiredCount > this.state.posts.length) {
       if (this.state.next) {
         footer = <div className="text-center">{Utils.spinner()}</div>;
       } else {
         footer = <h4 className="gray_text text-center">No more posts to show</h4>;
       }
     } else if (
       this.state.requiredCount < this.state.posts.length ||
         this.state.requiredCount === this.state.posts.length &&
         this.state.next
       ) {
       footer = <a style={{"display":"block"}} href="#" onClick={this.clickedSeeMore}>
         <div
           style={{"padding":"5px"}}
           className="bg-info text-center">
           See More
         </div>
       </a>;
     }
    return (
      <div>
        {posts_section}
        <div style={{"height": "100px"}}>
          {footer}
        </div>
      </div>
    );
  },

  clickedSeeMore: function(event) {
    this.setState({requiredCount: this.state.requiredCount + 10});
    event.preventDefault();
  },
});