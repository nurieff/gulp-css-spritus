# gulp-css-spritus

Parses your CSS to find the sprites and then creates, saves and compresses
Easy to use with your CSS, SASS (SCSS) and others

## Install
```
npm install gulp-css-spritus --save
```

## Easy
### main.css
```
.icon {
    background-image: spritus-url("assets/images/icons/*.png");
    background-size: spritus-size("assets/images/icons/*.png");
}

.icon-google {
    background-position: spritus-position("assets/images/icons/*.png", "google.png");
    height: spritus-height("assets/images/icons/*.png", "google.png");
    width: spritus-width("assets/images/icons/*.png", "google.png");
}
```
### app.scss
```
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
```
### gulpfile.js
```
var gulp = require("gulp");
var sass = require("gulp-sass");
var spritus = require("gulp-css-spritus");

gulp.task("scss", function () {
    return gulp.src("./scss/app.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(spritus({
        imageDirSave: "public/images/",
        imageDirCSS: "../images/",
    }))
    .pipe(gulp.dest("./public/css"));
});
```
## Expert
### gulpfile.js
```
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
```
$icons-sprite: "assets/images/icons/*.png";
```

### Methods
`spritus-url($icons-sprite)`
is replaced by a relative link to the sprite
`url("../images/icons.png")`
***
`spritus-size($icons-sprite)`
is replaced with the size of the sprite
`30px 180px`
***
`spritus-position($icons-sprite, "%file_name%")`
is replaced by the position of the image in the sprite
`background-position: 0px 60px`.

***
`spritus-height($icons-sprite, "%file_name%")` and `spritus-width($icons-sprite, "%file_name%")` is replaced by height and width in pixels `30px`

***
`%file_name%` — may be full `filename.png` or only basename `filename` without extension

### Inline options
```
$icons-sprite: "assets/images/icons/*.png?padding=30&algorithm=diagonal&name=newicons";
```
- **padding** — see description in *Plugin options*
- **algorithm** — see description in *Plugin options*
- **name** — another name of the sprite to save


## Plugin options
```
...
.pipe(spritus({
    padding: 2,
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
...
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



