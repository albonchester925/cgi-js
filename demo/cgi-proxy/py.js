// License: MIT
// Dynamic CGI serving using dynamic path imports for 
//      CGI supporting executable for Interpreted languages Embedded Distribution
// Contribution: 2018 Ganesh K. Bhat <ganeshsurfs@gmail.com> 
// 

const fs = require('fs');
const os = require("os");
const express = require('express');
const URL = require('url');
const path = require("path");
const cgijs = require("../../src");
// const cgijs = require("cgijs");

var cgi = cgijs.init();
var app = express();


const ostype = os.type();
var configuration;

if (ostype === "Linux") {
    configuration = JSON.parse(fs.readFileSync('./demo/config-linux.json'));
} else if (ostype === "Windows_NT") {
    configuration = JSON.parse(fs.readFileSync('./demo/config-win.json'));
} else if (ostype === "Darwin") {
    configuration = JSON.parse(fs.readFileSync('./demo/config-mac.json'));
}

let py_bin = configuration.py.embed.bin
let py_www = configuration.py.script.path

function response(type, exeOptions) {
    var cgi = cgijs.init();
    return function (req, res, next) {
        let requestObject = {
            url: URL.parse(req.originalUrl),
            originalUrl: req.originalUrl,
            query: req.url.query,
            method: req.method,
            body: req.body,
            ip: req.ip,
            headers: req.headers
        }
        cgi.serve(type, requestObject, exeOptions).then(function (result) {
            result.statusCode = (!result.statusCode) ? 200 : result.statusCode;
            res.status(result.statusCode).send(result.response);
        }.bind(res)).catch(function (e) {
            e.statusCode = (!e.statusCode) ? 500 : e.statusCode;
            res.status(e.statusCode).send(e.response);
        });
    };
}

// PYTHON File
app.use("/py", response('py', { web_root_folder: py_www, bin: { bin_path: "", useDefault: true }, config_path: '', host: configuration.server.host, port: configuration.server.port, cmd_options: {} }));
// PYTHON3 File
app.use("/py3", response('py3', { web_root_folder: py_www, bin: { bin_path: "", useDefault: true }, config_path: '', host: configuration.server.host, port: configuration.server.port, cmd_options: {} }));
// PYTHON File with useDefault as false
app.use("/pynud", response('py', { web_root_folder: py_www, bin: { bin_path: py_bin, useDefault: false }, config_path: '', host: configuration.server.host, port: configuration.server.port, cmd_options: {} }));
// PYTHON3 File with useDefault as false
app.use("/pynud3", response('py3', { web_root_folder: py_www, bin: { bin_path: py_bin, useDefault: false }, config_path: '', host: configuration.server.host, port: configuration.server.port, cmd_options: {} }));

module.exports = app;
