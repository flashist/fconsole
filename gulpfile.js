var gulp = require("gulp");
var requireDir = require("require-dir");

var tasks = requireDir("./gulp/tasks");

gulp.task(
    'build',
    gulp.series(
        "clean",
        "generate-definitions",
        "copy-to-dist",
        "compile"
    )
);

// Default
gulp.task(
    "default",
    gulp.series(
        "build"
    )
);