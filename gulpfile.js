var gulp = require("gulp");
var fbuildscripts = require("@flashist/fbuildscripts");

// Importing all the build-scripts
var taskNames = Object.keys(fbuildscripts);
console.log("task names: ", taskNames);
var taskNamesCount = taskNames.length;
for (let taskNameIndex = 0; taskNameIndex < taskNamesCount; taskNameIndex++) {
    var tempTaskName = taskNames[taskNameIndex];
    gulp[tempTaskName] = tasks[tempTaskName];
}