var site = site || {};

/**
 * Class that hides and shows items from a menu list.
 * The javascript adds a css class to show and hide individual content list items.
 * Animation is handle through the css itself by the adding and removing the active class when needed.
 * Here is a summary of the basic structure of the menu this class assumes.
 *
 *    STRUCTURE
 *    <section class="js-menu-list">
 *      <ul class="slides container" role="list">
 *         <li data-menu-id="slide-1" class="js-menu-slide active" role="listitem">
 *           ....
 *      <ul class="menu container" role="list">
 *          <li data-menu-id="slide-11" class="js-menu-item active" role="menuitem">
 *
 *     OPTIONS
 *     For deep linking, add the same slide id to the url and the page will go to the specific slide
 *     in the menu.
 *
 *     Examples:
 *     /debt-options/#2
 *     /debt-options/#slide2
 */
site.menuList = {
  /**
   * Defaults for nodes, class names and attribute names.
   */
  nodes: {
    container: '',
    slides: '',
    menuItems: '',
    menuTrigger: ''
  },

  classes: {
    container: '.js-menu-list',
    active: ' active',
    btnNext: '.js-menu-btn-next',
    btnPrev: '.js-menu-btn-prev',
    slide: '.js-menu-slide',
    menuItem: '.js-menu-item',
    menuTrigger: '.js-menu-trigger'
  },

  attributes: {
    menuId: 'data-menu-id'
  },

  slideIndex: 0,

  /**
   * Helper method to collect all nodes needed for slideshow.
   */
  getNodes: function() {
    this.nodes.slides = this.nodes.container.querySelectorAll(this.classes.slide);
    this.nodes.menuItems = this.nodes.container.querySelectorAll(this.classes.menuItem);
    this.nodes.menuTriggers = document.querySelectorAll(this.classes.menuTrigger);
    this.nodes.btnNext = document.querySelectorAll(this.classes.btnNext);
    this.nodes.btnPrev = document.querySelectorAll(this.classes.btnPrev);
  },

  /**
   * Helper method to remove the active class for the passed nodelist.
   * @param {nodelist} nodes - *REQUIRED* Nodelist to have active class removed from.
   */
  resetNodes: function(nodes) {
    var that = this;
    if (!nodes || !nodes.length) {
      return false;
    }
    Array.prototype.forEach.call(nodes, function(node) {
      if (node && node.className) {
        if (node.className.indexOf(that.classes.active) !== -1) {
          node.className = node.className.replace(that.classes.active, '');
        }
      }
    })
  },

  /**
   * Helper method to add the active class to a specific node in the nodelist.
   * @param {nodelist} nodes - Nodelist to have active class removed from.
   * @param {string} id - *REQUIRED* Slide id
   */
  setActiveNodeById: function(nodes, id) {
    var that = this;
    var activeNode = {};
    var activeNodeArray = [];

    if (!id ||
        !nodes ||
        !nodes.length) {
      return false;
    }

    activeNodeArray = Array.prototype.filter.call(nodes, function(node) {
      if (node && node.getAttribute(that.attributes.menuId) === id) {
        return node;
      }
    });

    activeNode = activeNodeArray[0] || nodes[0];
    if ( activeNode && activeNode.className.indexOf(that.classes.active) === -1 ) {
      activeNode.className += that.classes.active;
    }
  },

  /**
   * Helper method to get the slide index based on data-menu-id
   */
  getSlideIndexById: function(id) {
    var that = this;
    var slideIndex = 0;
    Array.prototype.forEach.call(that.nodes.slides, function(node, index) {
      if (node && node.getAttribute(that.attributes.menuId) === id) {
        slideIndex = index;
      }
    });

    return slideIndex;
  },

  /**
   * Helper method that handles getting the slide id and calling the methods to set the slide and menu.
   */
  setActiveSlide: function(args) {
    var menuId = this.getMenuId(args);

    // Handle resetting and setting active slide
    this.resetNodes(this.nodes.slides);
    this.setActiveNodeById(this.nodes.slides, menuId);
    // Handle resetting the menu and setting active menu item
    this.resetNodes(this.nodes.menuItems);
    this.setActiveNodeById(this.nodes.menuItems, menuId);

    this.slideIndex = this.getSlideIndexById(menuId);

    //this.setURLHash(menuId);
  },

  /**
   * Helper method that sets window.location.href to the current origin and pathname with the slide id hash.
   */
  setURLHash: function(id) {
    var origin = window.location.origin || '';
    var fullURL = origin ? origin + window.location.pathname : '';

    if (fullURL) {
      window.location.href = fullURL + '#' + id;
    }
  },

  /**
   * Helper method to get menu id based on pass slide node, menu id or index of slide.
   *
   * @param args
   * @returns {string} menuId slide menu id
   */
  getMenuId: function(args) {
    var _args = args || {};
    var menuId = '';

    if (!_args.slide &&
      !_args.id &&
      (_args.index === '' && _args.index === undefined)) {
      return null;
    }

    if (_args.slide) {
      menuId = _args.slide.getAttribute(this.attributes.menuId);
    }

    if (_args.id) {
      menuId = _args.id;
    }

    if (_args.index !== '' && _args.index !== undefined) {
      index = _args.index;

      if (index < 0) {
        index = this.nodes.slides.length -1;
      }

      if (index >= this.nodes.slides.length) {
        index = 0;
      }

      var slideNode = this.nodes.slides[index];
      menuId = slideNode ? slideNode.getAttribute(this.attributes.menuId) : '';
    }

    return menuId;
  },

  /**
   * Helper method to add the click events to any page elements that need to navigate to and
   * possibly change the active slide. Assumes the element contains a
   */
  setMenuTriggers: function() {
    var that = this;
     Array.prototype.forEach.call(this.nodes.menuTriggers, function(node) {
      node.addEventListener('click', function(e) {
        e.preventDefault();
        window.location = (this.attributes.href && this.attributes.href.nodeValue) || window.location.href;
        that.triggerLocCheck();
      });
    });

  },

  /**
   * Helper method to add the click events to set the active slide.
   */
  setMenu: function() {
    var that = this;
    Array.prototype.forEach.call(this.nodes.menuItems, function(node) {
      node.addEventListener('click', function(e) {
        e.preventDefault();
        that.setActiveSlide({
          slide: this
        });
      });
    });
  },

  /**
   * Helper method to add the click events to next and prev buttons if available..
   */
  setButtons: function() {
    var that = this;

    if (this.nodes.btnNext.length) {
      Array.prototype.forEach.call(this.nodes.btnNext, function(node) {
        node.addEventListener('click', function(e) {
          e.preventDefault();
          that.setActiveSlide({
            index: that.slideIndex + 1
          });
        });
      });
    }

    if (this.nodes.btnPrev.length) {
      Array.prototype.forEach.call(this.nodes.btnPrev, function(node) {
        node.addEventListener('click', function(e) {
          e.preventDefault();
          that.setActiveSlide({
            index: that.slideIndex - 1
          });
        });
      });
    }
  },

  /**
   * Helper method that checks for an anchor link that matches a slide.
   * Used for deep linking from other parts of the site.
   */
  setWindowLoc: function() {
    var that = this;
    document.addEventListener("menu:loaded", function(e) {
      var windowHash = window.location.hash;
      if (windowHash) {
        that.setActiveSlide({
          id: windowHash.replace('#', '')
        });
        window.location.href = windowHash;
      }
    });
  },

  /**
   * Method that triggers 'menu:loaded' event after everything is set after page load.
   */
  triggerLocCheck: function() {
    if (site.utils.events) {
      setTimeout(function() {
        site.utils.events.dispatch('menu:loaded');
      }, 200);
    }
  },

  /**
   * Helper method that returns true or false depending on a slideshow contianer being available.
   * @returns boolean
   */
  setContainer: function() {
    this.nodes.container = document.querySelector(this.classes.container);
    if (this.nodes.container === null) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * Helper method to initialize the slideshow.
   */
  init: function() {
    if ( !this.setContainer() ) {
      return false;
    }
    this.getNodes();
    this.setMenu();
    this.setButtons();
    this.setWindowLoc();
    this.triggerLocCheck();
    this.setMenuTriggers();
  }
};

document.addEventListener("DOMContentLoaded", function() {
  site.menuList.init();
});
