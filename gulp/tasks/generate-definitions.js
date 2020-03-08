var gulp = require("gulp");
var fs = require("fs");
var path = require("path");
var map = require("gulp-map");
var glob = require("glob");

gulp.task(
    "generate-definitions",
    async () => {

        await new Promise(
            (resolve) => {

                // console.log("START! generate-definitions.js");

                var getSafeDirPath = function(dirPath) {
                    dirPath += dirPath.charAt(dirPath.length - 1) == "/" ? "" : "/";
                    return dirPath;
                };

                var argv = {};

                var basePath = "./src/";
                // console.log("BEFORE argv.src: " + argv.src);
                argv.src = argv.src ? argv.src : basePath;
                // Adding a closing slash to make correct folder path (if needed)
                argv.src = getSafeDirPath(argv.src);
                // console.log("AFTER argv.src: " + argv.src);

                // console.log("BEFORE argv.outFile: " + argv.outFile);
                argv.outFile = argv.outFile ? argv.outFile : "index";
                // console.log("AFTER argv.outFile: " + argv.outFile);

                // console.log("BEFORE argv.outDir: " + argv.outDir);
                argv.outDir = argv.outDir ? argv.outDir : basePath;
                argv.outDir = getSafeDirPath(argv.outDir);
                // console.log("AFTER argv.outDir: " + argv.outDir);

                var outFileName = argv.outFile + ".ts";
                // console.log("outFileName: " + outFileName);
                // Remove prev index file
                if (fs.existsSync(basePath + outFileName)) {
                    fs.unlinkSync(basePath + outFileName);
                }

                var resultDeclarationText = "";

                // console.log("Imported files:");
                var tempSettings = `${argv.src}**/*.ts`;

                glob(
                    tempSettings,
                    (error, files) => {
                        var filesCount = files.length;
                        for (var fileIndex = 0; fileIndex < filesCount; fileIndex++) {
                            var singleFile = files[fileIndex];
                            console.log("singleFile: ", singleFile);

                            let importPath = path.relative(basePath, singleFile);
                            if (importPath.indexOf(".d.ts") != -1) {
                                importPath = importPath.substr(0, importPath.lastIndexOf(".d.ts"));
                            } else if (importPath.indexOf(".ts") != -1) {
                                importPath = importPath.substr(0, importPath.lastIndexOf(".ts"));
                            }
                            // console.log("- " + importPath);

                            resultDeclarationText += "export * from '" + "./" + importPath + "'";
                            resultDeclarationText += "\n";
                        }

                        console.log("Declarations: ");
                        console.log(resultDeclarationText);

                        fs.writeFile(
                            argv.outDir + outFileName,
                            resultDeclarationText,
                            () => {
                                console.log("WRITE COMPLETE!");
                                resolve();
                            }
                        );
                    }
                );
            }
        );
    }
);