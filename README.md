# gulp-css-spritus

Parses your CSS to find the sprites and then creates, saves and compresses

Easy to use with your CSS, SASS (SCSS) and others

*For [PostCSS](http://postcss.org) use [postcss-spritus](https://www.npmjs.com/package/postcss-spritus)*

## Install
```
npm install gulp-css-spritus --save
```

## Easy
### CSS
```css
.icon {
    background-image: spritus-url("assets/images/icons/*.png");
    background-size: spritus-size("assets/images/icons/*.png");
}

.icon-google {
    background-position: spritus-position("assets/images/icons/*.png", "google.png");
    height: spritus-height("assets/images/icons/*.png", "google.png");
    width: spritus-width("assets/images/icons/*.png", "google.png");
}

/** OR **/

.icon {
    spritus: each("assets/images/icons/*.png")
}

```
### SCSS
```scss
$icons-sprite: "assets/images/icons/*.png";

.icon {
    background-image: spritus-url($icons-sprite);
    background-size: spritus-size($icons-sprite);
}

.icon-google {
    background-position: spritus-position($icons-sprite, "google.png");
    height: spritus-height($icons-sprite, "google.png");
    width: spritus-width($icons-sprite, "google.png");
}

.icon-vk {
    background-position: spritus-position($icons-sprite, "vk");
    height: spritus-height($icons-sprite, "vk");
    width: spritus-width($icons-sprite, "vk");
}
.icon-twitter {
    spritus:phw($icons-sprite, "twitter");
}
```
### gulpfile.js
```javascript
var gulp = require("gulp");
var sass = require("gulp-sass");
var spritus = require("gulp-css-spritus");

//SCSS
gulp.task("scss", function () {
    return gulp.src("./assets/scss/app.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(spritus({
        imageDirSave: "public/images/",
        imageDirCSS: "../images/",
    }))
    .pipe(gulp.dest("./public/css"));
});

//CSS
gulp.task("css", function () {
    return gulp.src("./assets/css/main.css")
    .pipe(spritus({
        imageDirSave: "public/images/",
        imageDirCSS: "../images/",
    }))
    .pipe(gulp.dest("./public/css"));
});
```
## Expert
### gulpfile.js
```javascript
var gulp = require("gulp")
    , merge = require("merge-stream")
    , sass = require("gulp-sass")
    , spritus = require("gulp-css-spritus")
    , imagemin = require("gulp-imagemin")
    , cssnano = require("gulp-cssnano")
    , imageminPngquant = require("imagemin-pngquant")
    , imageminMozjpeg = require("imagemin-mozjpeg")
    , buffer = require("vinyl-buffer")
    ;

gulp.task("scss", function () {
    var spritus = gulp.src("./scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(spritus({
            padding: 2,
            algorithm: "top-down",
            saveImage: false,
            withImagemin: false,
            withImageminPlugins: null,
            imageDirCSS: "../images/",
            imageDirSave: "public/images/"
        }));
    
    var stream_css = spritus.css
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public/css"));
        
        
    var stream_img = spritus.img
        .pipe(buffer())
        .pipe(imagemin(
            [
                imageminMozjpeg(),
                imageminPngquant({
                    quality: "60-70",
                    speed: 1
                })
            ]
        ))
        .pipe(gulp.dest("./public/images"));
});
```

## Methods and options
The path relative to the root of the script
```scss
$sprite: "assets/images/icons/*.png";
```

### Methods

Method | Description
------ | -----------
`spritus-url($sprite);` | is replaced by a relative link to the sprite `url("../images/icons.png")`
`spritus-size($sprite);` | is replaced with the size of the sprite
`spritus-position($sprite, "%file_name%");` | is replaced by the position of the image in the sprite
`spritus-height($sprite, "%file_name%");` | is replaced by height in pixels
`spritus-width($sprite, "%file_name%");` | is replaced by width in pixels
`spritus:phw($sprite, "%file_name%");` | is replaced by the position, height and width of the image in sprite `background-position: 0px 60px;height:30px;width:30px;`
`spritus:each($sprite);` | is replaced by all sprite image. See example below
***
`%file_name%` — may be full `filename.png` or only basename `filename` without extension
***
How does `spritus:each($sprite);`
##### In
```css
/** example 1 **/
.myprefix {
    spritus:each("assets/images/icons/*.png")
}

/** example 2 **/
i.prefix {
    display:none;
    spritus:each("assets/images/icons/*.png")
}
```
##### Out

```css
/** example 1 **/
.myprefix-google {
    background-position: 0px 26px;height: 26px;width: 26px;
}
.myprefix-twitter {
    background-position: 0px 42px;height: 26px;width: 26px;
}
...

/**  example 2 **/
i.prefix-google {
    display:none;
    background-position: 0px 26px;height: 26px;width: 26px;
}
i.prefix-twitter {
    display:none;
    background-position: 0px 42px;height: 26px;width: 26px;
}
...
```

### Inline options
```
$icons-sprite: "assets/images/icons/*.png?padding=30&algorithm=diagonal&name=newicons";
```
- **padding** — see description in *Plugin options*
- **algorithm** — see description in *Plugin options*
- **name** — another name of the sprite to save


## Plugin options
```javascript
// ...
.pipe(spritus({
    padding: 2,
    searchPrefix: "spritus",
    algorithm: "top-down",
    saveImage: true,
    withImagemin: true,
    withImageminPlugins: [
        imageminPngquant({
           quality: "60-70",
           speed: 1
       })
    ],
    imageDirCSS: "../images/",
    imageDirSave: "public/images/"
}))
// ...
``` 
**padding** 

The amount of transparent space, in pixels, around each sprite. Defaults to `2`

***
**saveImage**

Save or don't save. Defaults to `true`

***
**withImagemin**

Compression of the sprite using [imagemin][]. Defaults to `true`

***
**withImageminPlugins** 

Specify what to use plugins for. Defaults to `[require('imagemin-pngquant')({quality: "60-70",speed: 1})]`

***
**imageDirCSS**

Relative URL (background-image) which is replaced in position in your CSS. Defaults to `../images/`


***
**imageDirSave**

The path where to save the sprites relative to the root of the script. Defaults to `public/images/`

***
**searchPrefix**

If you want to use a different prefix, then this option is for you.
Defaults to `spritus`

*gulpfile.js*

```javascript
// ...
.pipe(spritus({
    searchPrefix: "myprefix"
}))
// ...
```
Now you can now use

*SCSS*
```scss
.icon {
    background-image: myprefix-url($icons-sprite);
    background-size: myprefix-size($icons-sprite);
}

.icon-google {
    background-position: myprefix-position($icons-sprite, "google.png");
    height: myprefix-height($icons-sprite, "google.png");
    width: myprefix-width($icons-sprite, "google.png");
}
```

***
**algorithm**

Images can be laid out in different fashions depending on the algorithm. We use [layout][] to provide you as many options as possible. . Defaults to `top-down`.At the time of writing, here are your options for `algorithm`:

[layout]: https://github.com/twolfson/layout
[imagemin]: https://github.com/imagemin/imagemin

|         `top-down`        |          `left-right`         |         `diagonal`        |           `alt-diagonal`          |          `binary-tree`          |
|---------------------------|-------------------------------|---------------------------|-----------------------------------|---------------------------------|
| ![top-down][top-down-img] | ![left-right][left-right-img] | ![diagonal][diagonal-img] | ![alt-diagonal][alt-diagonal-img] | ![binary-tree][binary-tree-img] |

[top-down-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/top-down.png
[left-right-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/left-right.png
[diagonal-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/diagonal.png
[alt-diagonal-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/alt-diagonal.png
[binary-tree-img]: https://raw.githubusercontent.com/twolfson/layout/2.0.2/docs/binary-tree.png

More information can be found in the [layout][] documentation:



