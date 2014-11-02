/**
 * Created by krivopustov on 15.10.2014.
 */

/// <reference path="../lib/underscore.d.ts" />
/// <reference path="../lib/node.d.ts"/>
/// <reference path="../lib/commander.d.ts"/>
/// <reference path="../lib/restify.d.ts"/>

var _: UnderscoreStatic = require('underscore');
var restify = require('restify');
var fs = require('fs');
var child_process = require('child_process');
var filesize = require('filesize');

var program = require('commander');
program
    .option('-c, --command <command>', 'Full path to command')
    .option('-d, --root-dir <dir>', 'Root directory')
    .parse(process.argv);

var command: string = program.command;
if (!command) {
    console.log("command is not specified");
    process.exit(-1);
}

var root: string = program.rootDir;
if (!root)
    root = "/";
console.log("root: " + root);

var supportedExtensions = ["mp3", "flac", "cue"];

var commandOptions = {
    "play": "-t",
    "stop": "-s",
    "next": "-f",
    "prev": "-r"
};

function extIsSupported(name: string): boolean {
    var pos = name.lastIndexOf(".");
    if (pos == -1 || pos == name.length - 1)
        return false;
    var ext = name.substring(pos + 1).toLowerCase();
    return supportedExtensions.indexOf(ext) > -1;
}

function list(req, res, next) {
    console.log("list?dir=%s", req.query.dir);

    var path = root;
    if (req.query.dir)
        path += "/" + req.query.dir;

    fs.readdir(path, (err, files) => {
        var result = [];
        for (var i = 0; i < files.length; i++) {
            var name: string = files[i];
            var size: number;

            var stats = fs.statSync(path + "/" + name);
            if (stats.isDirectory()) {
                size = -1;
            } else {
                size = filesize(stats["size"]);
            }
            if (stats.isDirectory() || extIsSupported(name))
                result.push({path: req.query.dir + "/" + name, size: size});
        }
        res.send(result);
    });
    next();
}

function control(req, res, next) {
    var option = commandOptions[req.query.cmd];
    console.log("command " + option);
    if (option) {
        child_process.execFile(command, [option]);
        res.send("ok");
    } else {
        res.send("unsupported option");
    }
    next();
}

function add(req, res, next) {
    var path = root + "/" + req.query.path;
    console.log("adding " + path);
    child_process.execFile(command, ["-E", path]);
    res.send("ok");
    next();
}

var server = restify.createServer();
server.use(restify.queryParser());

server.get("/list", list);
server.get("/control", control);
server.get("/add", add);

server.get(/.*/, restify.serveStatic({
    directory: './client',
    default: 'index.html'
}));

server.listen(8080, () => {
    console.log("%s listening at %s", server.name, server.url);
});