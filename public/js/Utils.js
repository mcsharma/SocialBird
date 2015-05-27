var Utils = {
  getPageDataForID: function(pages, page_id) {
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id == page_id.toString()) {
        return pages[i];
      }
    }
    return null;
  },
  getPictureOfHeight(photoNode, height) {
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
};