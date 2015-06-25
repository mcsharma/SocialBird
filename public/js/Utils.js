var Utils = (function () {

  this.getPageDataForID = function(pages, page_id) {
    if (!page_id) {
      return null;
    }
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id == page_id.toString()) {
        return pages[i];
      }
    }
    return null;
  };

  this.getPictureOfHeight = function(photoNode, height) {
    if (!photoNode.images) {
      return null;
    }
    for (var i = 0; i < photoNode.images.length; i++) {
      if (photoNode.images[i].height == height) {
        return photoNode.images[i].source;
      }
    }
    return null;
  }

  return this;

})();