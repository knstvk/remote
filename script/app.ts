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

var program = require('commander');
program.option('-d, --root-dir <dir>', 'Root directory')
    .parse(process.argv);

var root: string = program.rootDir;
if (!root)
    root = "c:\\";
console.log("root: " + root);

function list(req, res, next) {
    console.log("list?dir=%s", req.query.dir);

    var path: string = root;
    if (req.query.dir)
        path += "/" + req.query.dir;

    fs.readdir(path, (err, files) => {
        var result = [];
        for (var i = 0; i < files.length; i++) {
            var name: String = files[i];
            var size: number;

            var stats = fs.statSync(path + "/" + name);
            if (stats.isDirectory()) {
                size = -1;
            } else {
                size = stats["size"];
            }
            result.push({path: req.query.dir + "/" + name, size: size});
        }
        res.send(result);
    });

//    res.send([
//        {path: "Radiohead", size: -1},
//        {path: "Joe  Bonamassa", size: -1}
//    ]);
    next();
}

var server = restify.createServer();
server.use(restify.queryParser());

server.get("/list", list);

server.get(/.*/, restify.serveStatic({
    directory: './client',
    default: 'index.html'
}));

server.listen(8080, () => {
    console.log("%s listening at %s", server.name, server.url);
});