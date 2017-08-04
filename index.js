var
  through = require('through2').obj
  , cssSpritus = require('../css-spritus/index.js')
;

function GulpCssSpritus(config) {

  this.config = {
    padding: 2,
    algorithm: 'top-down', // left-right,diagonal,alt-diagonal,binary-tree
    searchPrefix: 'spritus',
    saveImage: true,
    withImagemin: true,
    withImageminPlugins: null,
    imageDirCSS: '../images/',
    imageDirSave: 'public/images/'
  };

  /**
   * @type {Buffer}
   */
  this.css = null;

  this.imgStream = through();
  this.cssStream = through();
  this.retStream = null;

  /**
   * @type {Function}
   */
  this.endCallback = null;

  if (config) {
    for (var key in config) {
      if (!config.hasOwnProperty(key)) continue;

      if (key in this.config) {
        this.config[key] = config[key];
      }
    }
  }
}

GulpCssSpritus.prototype.onData = function(file, encoding, cb) {
  this.css = file;
  cb();
};

GulpCssSpritus.prototype.onEnd = function(cb) {

  if (!this.css) {
    this.imgStream.push(null);
    this.cssStream.push(null);
    return cb();
  }

  this.endCallback = cb;

  var cssS = cssSpritus.findInContent(this.css.contents.toString(), this.config);

  if (!cssS) {
    this.imgStream.push(null);
    this.cssStream.push(this.css);
    this.retStream.push(this.css);
    return cb();
  }
  cssS.withImageStream(this.imgStream);
  cssS.replace(this.make.bind(this));
};

GulpCssSpritus.prototype.make = function(strCSS, cssSpritus) {
  this.css.contents = new Buffer(strCSS);

  this.imgStream.push(null);
  this.cssStream.push(this.css);
  this.retStream.push(this.css);

  this.endCallback();
};

//**************
module.exports = function(config) {

  var S = new GulpCssSpritus(config);

  S.retStream = through(S.onData.bind(S), S.onEnd.bind(S));
  S.retStream.css = S.cssStream;
  S.retStream.img = S.imgStream;

  return S.retStream;
};