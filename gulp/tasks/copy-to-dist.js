var gulp = require("gulp");

gulp.task(
    "copy-to-dist",
    function () {
        // console.log("START! copy-to-dist.js");

        return gulp.src(
                ["./package.json"]
            )
            .pipe(
                gulp.dest("./dist")
            );
    }
);
