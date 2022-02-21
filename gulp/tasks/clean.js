var gulp = require("gulp");
var rimraf = require("rimraf");

gulp.task(
    "clean",
    (cb) => {
        return rimraf("./dist/**/*", cb);
    }
);