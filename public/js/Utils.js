var Utils = {
  getPageDataForID: function(pages, page_id) {
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id == page_id.toString()) {
        return pages[i];
      }
    }
    return null;
  }
};