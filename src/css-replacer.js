/**
 * @param {String} css
 * @param {SpritusList} SpritusList
 * @constructor
 */
function SpritusCssReplacer(css, SpritusList) {
  /**
   * @type {String}
   */
  this.css = css;

  /**
   * @type {SpritusList}
   */
  this.SpritusList = SpritusList;
}

SpritusCssReplacer.prototype._reg = function (mod, dopArgs) {

  var r = [];
  r.push('spritus');
  if (mod) {
    r.push("\\-" + mod);
  }

  if (dopArgs) {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"");
    r.push(",?\\s*?\\\"?([^\\)\\\"]*)\\\"?\\)");
  } else {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"\\)");
  }

  return new RegExp(r.join(''), 'ig');
};

SpritusCssReplacer.prototype._regAsProperty = function (mod, dopArgs) {

  var r = [];
  r.push('spritus\\:\\s*?');
  r.push(mod);

  if (dopArgs) {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"");
    r.push(",?\\s*?\\\"?([^\\)\\\"]*)\\\"?\\)");
  } else {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"\\)");
  }

  return new RegExp(r.join(''), 'ig');
};

SpritusCssReplacer.prototype._position = function () {
  var self = this;
  this.css = this.css.replace(this._reg('position', true), function () {
    var str = arguments[1];
    var img = arguments[2];

    if (!img || !self.SpritusList.get(str)) {
      return '0px 0px';
    }

    return self.SpritusList.get(str).position(img);
  });

  return this;
};

SpritusCssReplacer.prototype._url = function () {
  var self = this;
  this.css = this.css.replace(this._reg('url'), function () {
    var str = arguments[1];

    if (!self.SpritusList.get(str)) {
      return '';
    }

    return self.SpritusList.get(str).url();
  });

  return this;
};

SpritusCssReplacer.prototype._height = function () {
  var self = this;
  this.css = this.css.replace(this._reg('height', true), function () {

    var str = arguments[1];
    var img = arguments[2];

    if (!img) {
      return self.SpritusList.get(str).height();
    }

    if (!self.SpritusList.get(str)) {
      return 'auto';
    }

    return self.SpritusList.get(str).height(img);
  });

  return this;
};

SpritusCssReplacer.prototype._width = function () {
  var self = this;
  this.css = this.css.replace(this._reg('width', true), function () {

    var str = arguments[1];
    var img = arguments[2];

    if (!img) {
      return self.SpritusList.get(str).width();
    }

    if (!self.SpritusList.get(str)) {
      return 'auto';
    }

    return self.SpritusList.get(str).width(img);
  });

  return this;
};

SpritusCssReplacer.prototype._size = function () {
  var self = this;
  this.css = this.css.replace(this._reg('size'), function () {

    var str = arguments[1];

    if (!self.SpritusList.get(str)) {
      return 'auto auto';
    }

    return self.SpritusList.get(str).size();
  });

  return this;
};

SpritusCssReplacer.prototype._phw = function () {
  var self = this;
  this.css = this.css.replace(this._regAsProperty('phw', true), function () {
    var str = arguments[1];
    var img = arguments[2];

    if (!img || !self.SpritusList.get(str)) {
      return '';
    }

    return [
      'background-position: ' + self.SpritusList.get(str).position(img),
      'height: ' + self.SpritusList.get(str).height(img),
      'width: ' + self.SpritusList.get(str).width(img)
    ].join(';');
  });

  return this;
};

SpritusCssReplacer.prototype._all = function () {
  var self = this;
  this.css = this.css.replace(this._reg('all',true), function () {

    var str = arguments[1];
    var prefix = arguments[2];

    if (prefix.indexOf('.') === -1) {
      prefix = '.' + prefix;
    }

    if (!self.SpritusList.get(str)) {
      return '';
    }

    var css = [];

    var nodes = self.SpritusList.get(str).all();
    var n;
    for(var key in nodes) {
      if (!nodes.hasOwnProperty(key)) continue;

      n = [];

      n.push(prefix.trim() + '-' + key);
      n.push('{');

      n.push([
        'background-position: ' + nodes[key].position,
        'height: ' + nodes[key].height,
        'width: ' + nodes[key].width
      ].join(';'));

      n.push('}');

      css.push(n.join(' '));
    }

    return css.join("\n");
  });

  return this;
};

/**
 * @returns {SpritusCssReplacer}
 */
SpritusCssReplacer.prototype.run = function () {
  this._url()
    ._position()
    ._height()
    ._width()
    ._size()
    ._phw()
    ._all()
  ;

  return this;
};

/**
 * @returns {String}
 */
SpritusCssReplacer.prototype.getCss = function () {
  return this.css;
};

/**
 * @param {String} css
 * @param {SpritusList} SpritusList
 * @returns {String}
 */
SpritusCssReplacer.makeCSS = function (css, SpritusList) {
  var R = new SpritusCssReplacer(css, SpritusList);
  return R.run().getCss();
};

module.exports = SpritusCssReplacer;