var gulp = require("gulp");
var shell = require('gulp-shell');

gulp.task(
    "compile",
    function (cb) {

        gulp.src(".", {read: false})
            .pipe(
                shell(
                    ["tsc"]
                )

            ).on(
            "end",
            function () {
                cb();
            }

        ).on(
            "error",
            function () {
                console.error("ERROR! compile.js");
            }
        );
    }
);
