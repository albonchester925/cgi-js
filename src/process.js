/*
License: MIT
Dynamic CGI serving using dynamic path imports for 
     CGI supporting executable for Interpreted languages Embedded Distribution
Contribution: 2018 Ganesh K. Bhat <ganeshsurfs@gmail.com> 
*/

/* eslint no-console: 0 */
const https = require('https');
const fs = require('fs');
const os = require("os");
const util = require("util");
const process = require('process');
const path = require("path");
const execPath = process.execPath;
const utils = require("./utils")();
const setter = utils.setter, getter = utils.getter;

/**
 * 
 * handler
 * 
 * @returns {Object} Process module functions
 */
function handler() {
    let processes = {};

    let osList = ["win32", "win64", "Windows_NT", "darwin", "unix", "linux", "fedora", "debian"];
    let executableOptions = ["executable", "service", "file"];
    let processList = ["httpd", "tomcat", "mongoose", "putty", "nginx", "mysql", "pgsql", "top", "mysql", "mongodb", "pgsql"];

    let commandObject = {
        // name of the object that it should be stored or identifies as 
        name: "",
        // type --> One of the executableOptions options
        type: "executable",
        // os --> Any os in the osList
        os: "",
        // exe --> any executable or systemctl
        exe: "",
        // cmds will have list of actions/ prestored commands that may be needed for executing the process
        // cmds action execution will be controlled by and 
        //        depend on whether `other.command` key is specified during execution
        cmds: {
            start: { usage: "start", args: [] },
            stop: { usage: "stop", args: [] },
            restart: { usage: "restart", args: [] },
            // exe is optional and can be used if you want to override 
            //      the commandObject[exe] value for a specific command in commandObject[exe][cmds]
            generic: { exe: "", usage: "", args: [] }
        },
        // shell options for nodejs process `exec` function definition
        //      Will be passed as an arg for `process.exec` function inside implementation under the hood
        //      Defaults to { stdio: 'inherit', shell: true }
        options: {
            stdio: 'inherit',
            shell: true
        },
        other: {
            // Any paths that you want to store. Some common defaults are conf and exe
            paths: {
                "conf": "",
                "exe": ""
            },
            // Any specific environment that needs to be stored
            env: "",
            // `setprocess` will set the config in the processes object in this `process` object
            setprocess: false,
            // Execute type --> exec ( exe > { executable, service } )
            // Execute type --> spawn ( exe > { file } )
            // Execute type --> fork ( exe > { file } )
            executetype: "exec",
            // `command` will be use to execute one of the above cmds action in the cmds key by default 
            //          when the execProcess {exec, spawn, fork, execFile} is run
            command: ""
        }
    };


    /**
     * 
     * setupHandler
     * 
     * 
     * @param {*} name 
     * Name of the configuration or default that needs to be handled
     * 
     * @param {String, Array, Object} optionsObject 
     * name == osList -> {String, Array} optionsObject 
     * name == processList -> {Array} optionsObject
     * name == processes -> {Object, Array} optionsObject
     * 
     * @return {Boolean}
     * Returns the boolean is the setupHandler set the value successfully
     * 
     */
    function setupHandler(name, optionsObject) {
        if (!name || !optionsObject) {
            return false;
        }
        switch (name) {
            case "osList":
                if (Array.isArray(optionsObject)) {
                    for (let i = 0; i < optionsObject.length; i++) {
                        if (!optionsObject[i] in osList) {
                            osList.push(optionsObject[i]);
                        }
                    }
                    return true;
                } else if (typeof optionsObject === "string") {
                    if (!optionsObject in osList) {
                        osList.push(optionsObject);
                    }
                    return true;
                }
                return false;
            case "processList":
                if (Array.isArray(optionsObject)) {
                    for (let i = 0; i < optionsObject.length; i++) {
                        if (!optionsObject[i] in processList) {
                            processList.push(optionsObject[i]);
                        }
                    }
                    return true;
                }
                return false;
            case "processes":
                if (typeof optionsObject === "object") {
                    if (!optionsObject.name) {
                        return false;
                    }
                    return setter(processes, utils.convert.toObject( (optionsObject.name, optionsObject) ) );
                } else if (Array.isArray(optionsObject)) {
                    let oKeys = Object.keys(optionsObject);
                    for (let i = 0; i < optionsObject.length; i++) {
                        if (!optionsObject[i].name) {
                            return false;
                        }
                        return setter( processes, utils.convert.toObject( ( optionsObject[oKeys[i]].name, optionsObject[oKeys[i]] ) ) );
                    }
                }
                return false;
            default:
                return false;
        }
    }


    /**
     * Set/ Add the OS in the list of OS
     *
     * @param {*} obj
     * @return {Boolean} 
     */
    function setOS(obj) {
        if (typeof obj == "string") {
            osList.push(obj)
            return true;
        }
        return false;
    }


    /**
     * Check if OS in the list of OS
     * 
     * @param {String} name
     * @return {Boolean} 
     */
    function validOS(name) {
        if ((typeof obj == "string") && (osList.indexOf(name) !== -1)) {
            return name;
        }
        return false;
    }


    /**
     * Get the OS of the current system
     * 
     * @return {String} 
     */
    function getOS() {
        return os.type();
    }


    /**
     * 
     * getProcess
     * Returns the processes requested
     *
     * @param {String, Array} processNames
     *      processNames is single or Array of ids
     * 
     * @returns {Boolean, Object} processes
     *      processes: processes list object
     * 
     */
    function getProcess(processNames) {
        return getter(processes, processNames);
    }


    /**
     * 
     * setProcess
     * Sets the process of the connection key procId provided
     *
     * @param {Object} processConf
     *      
     * { name: String, type: String, os: String, exe: String, cmds: { commandOject }, process: Object, options { shellOptions }, other: { otherOptions }, [..keyargs..] }
     * 
     * - [..keyargs..]: Other custom keys for use with datahandler or cleanuphandler
     * 
     * - <commandObject>: { start: { subcommandObject }, stop: { subcommandObject }, restart: { subcommandObject }, generic: { subcommandObject } }
     * - <shellOptions>: { stdio: String, shell: Boolean }
     * - <otherOptions>: { paths: { conf: String, exe: String }, env: String, setprocess: Boolean, command: String }
     * - <subcommandObject>: { exe: [optional overide]String, usage: String, args: Array }
     * 
     * @returns {Boolean || Object} processes
     * 
     */
    function setProcess(processConf) {
        let setterVal = setter(processes, utils.convert.toObject((processConf.name, procConf)));
        if (!!setterVal) {
            processes = setterVal;
            return processes;
        }
        return false;
    }


    /**
     * 
     * exec
     * 
     * 
     * @param {String} exe
     * 
     * @param {Array Object} args
     * 
     * @param {Object} cmdOptions
     * 
     * @param {Function} dataHandler
     * 
     * @return {Object}
     * Executed exec Command process result
     *
     */
    function exec(exe, args, cmdOptions, dataHandler) {
        let ex = require('child_process').exec;
        return ex([exe, ...args].join(" "), cmdOptions, function (error, stdout, stderr) {
            dataHandler(error, stdout, stderr);
        });
    }


    /**
     * 
     * execFile
     * 
     * 
     * @param {String} file
     * 
     * @param {Array Object} args
     * 
     * @param {Object} cmdOptions
     * 
     * @param {Function} dataHandler
     * 
     * 
     * @return {Object}
     * Executed execFile process result
     *
     */
    function execFile(file, args, cmdOptions, dataHandler) {
        let ex = require('child_process').execFile;
        return ex(file, [...args], cmdOptions, function (error, stdout, stderr) {
            dataHandler(error, stdout, stderr);
        });
    }


    /**
     * 
     * fork
     * 
     * 
     * @param {String} modulePath
     * 
     * @param {Array Object} args
     * 
     * @param {Object} cmdOptions
     * 
     * @param {Function} dataHandler
     * 
     * 
     * @return {Object}
     * Executed Forked fork process result
     *
     */
    function fork(modulePath, args, cmdOptions, dataHandler) {
        let ex = require('child_process').fork;
        return ex(modulePath, [...args], cmdOptions);
    }


    /**
     * 
     * spawn
     * 
     * 
     * @param {String} exe
     * 
     * @param {Array Object} args
     * 
     * @param {Object} cmdOptions
     * 
     * @param {Function} dataHandler
     * 
     * @return {Object}
     * Executed Spawned spawn process result
     *
     */
    function spawn(exe, args, cmdOptions, dataHandler) {
        let ex = require('child_process').spawn;
        let spw = ex(exe, [...args], cmdOptions);
        let stdout, stderr, error;
        if (spw.keys().includes("stdout")) {
            spw.stdout.on('data', function (data) {
                stdout = dataHandler(null, data, null);
            }.bind(null, stdout));
        }
        if (spw.keys().includes("stderr")) {
            spw.stderr.on('data', function (data) {
                stderr = dataHandler(null, null, data);
            }.bind(null, stderr));
        }
        spw.on('error', function (err) {
            console.error('Failed to start subprocess.');
            error = dataHandler(err, null, null);
        }.bind(null, error));
        spw.on('close', function (code) {
            console.log(`child process exited with code ${code}`);
        });
        return spw;
    }


    /**
     * 
     * registerEventHandlers
     * 
     * 
     * @param {Object} proc
     * 
     * @param {Object} eventHandlers
     * 
     * { event : { data: dataObject, handler: eventHandlerFunction } }
     * 
     */
    function registerEventHandlers(processConf, eventHandlers) {
        let eKeys, eKeysLen;
        if (Array.isArray(eventHandlers)) {
            eKeys = eventHandlers;
            eKeysLen = eKeys.length;
        } else if (typeof eventHandlers === "function") {
            eKeys = eventHandlers.keys();
            eKeysLen = eKeys.length;
        }

        function cleanup(eventType, exitFunction, processConf) {
            console.log('registerEventHandlers: Cleanup Fnc EventType and Process PID: ', eventType, processConf["process"].pid);
            exitFunction(eventType, processConf);
        }

        for (let e = 0; e < eKeysLen; e++) {
            // let { data, handler } = eventHandlers[eKeys[e]];
            let handler = eventHandlers[eKeys[e]];
            processConf["process"].on(eKeys[e], cleanup.bind(null, eKeys[e], handler, processConf));
        }

        return processConf;
    }


    /**
     * 
     * executeProcess
     * 
     *
     * @param {Object} processConf
     * Defines the process Object needed to start the process
     * Expected Structure: {  }
     * 
     * process/server/database = 
     *  
     * @param {Function} dataHandler
     * 
     * @param {Function} cleanupHandler
     * 
     * @returns {Object} processConf
     * 
     * { name: String, type: String, os: String, exe: String, cmds: { commandOject }, process: Object, options { shellOptions }, other: { otherOptions }, [..keyargs..] }
     * 
     * - [..keyargs..]: Other custom keys (key-value) for use with your datahandler or cleanuphandler provided
     * 
     * - <commandObject>: { start: { subcommandObject }, stop: { subcommandObject }, restart: { subcommandObject }, generic: { subcommandObject } }
     * - <shellOptions>: { stdio: String, shell: Boolean }
     * - <otherOptions>: { paths: { conf: String, exe: String }, env: String, setprocess: Boolean, executetype: String, command: String }
     * - <subcommandObject> [optionals: exe, modulePath, file]: { exe: String, modulePath: String, file: String, usage: String, args: Array }
     * 
     */
    function executeProcess(processConf, dataHandler, cleanupHandler) {
        // {name: {commands, instances: {pid: instance}}}
        let proc, usage, args;

        // Signal Numbers - http://people.cs.pitt.edu/~alanjawi/cs449/code/shell/UnixSignals.htm
        let evt = [`exit`, `SIGHUP`, `SIGQUIT`, `SIGKILL`, `SIGINT`, `SIGTERM`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`];
        let evtLen = evt.length;

        let { name, exe, cmds, os, type, options, other } = processConf;

        if (!executableOptions.includes(type)) {
            utils.error("startProcess: Server Definition or Process Definition does not include type");
        }

        let executetype = "exec";
        if (!!other["executetype"]) {
            executetype = other["executetype"];
        }

        let executable = path.join(other.paths.exe, exe);
        if (!!other.command) {
            if (!cmds[other.command]) {
                utils.error("startProcess: Server Definition or Process Definition not allowed");
            } else {
                usage = cmds[other.command]["usage"];
                args = cmds[other.command]["args"];
                if (!!cmds[other.command]["exe"]) {
                    executable = path.join(other.paths.exe, cmds[other.command]["exe"]);
                }
            }
        }

        if (!other.command) {
            utils.error("startProcess: Server Definition or Process Definition does not have command to execute");
        }

        if (!usage) {
            usage = "";
        } else if (!!usage && usage != "") {
            utils.error("startProcess: Usage passed is incorrect");
        }

        if (!args) {
            args = [];
        } else if (!!args && !Array.isArray(args)) {
            utils.error("startProcess: Arguments passed is incorrect");
        }

        if (!dataHandler && (typeof dataHandler === "function" || dataHandler instanceof Function || Object.prototype.toString().call(dataHandler) == "[object Function]")) {
            let dataHandler = function (error, stdout, stderr) { };
        }

        if (!cleanupHandler && (typeof cleanupHandler === "function" || cleanupHandler instanceof Function || Object.prototype.toString().call(cleanupHandler) == "[object Function]")) {
            let cleanupHandler = function (options, prc) { };
        }

        if (executetype === "exec") {
            proc = exec(executable, [usage, ...args], options, dataHandler);
        } else if (executetype === "spawn") {
            proc = spawn(executable, [usage, ...args], options, dataHandler);
        } else if (executetype === "execFile") {
            proc = execFile(executable, [usage, ...args], options, dataHandler);
        } else if (executetype === "fork") {
            proc = fork(executable, [usage, ...args], options, dataHandler);
        }

        processConf["pid"] = proc.pid;
        processConf["process"] = proc;

        process.stdin.resume();
        // proc.unref();

        function cleanupSrv(eventType, exitFunction, processConf) {
            console.log('startProcess: Cleanup Function, EventType, and Process PID: ', eventType, processConf["pid"].pid);
            exitFunction(eventType, processConf);
        }

        for (let i = 0; i < evtLen; i++) {
            console.log("Event Logging: ", evt[i]);
            proc.on(evt[i], cleanupSrv.bind(null, evt[i], cleanupHandler, processConf));
        }

        if (!!other.setprocess) {
            let setprc = setProcess(processConf);
            if (!!setprc) { /* Do something here - callback */ }
        }

        return processConf;
    }


    /**
     *
     * executeAction
     *
     * @param {String} name 
     * 
     * @param {String} action
     * One of many actions in `cmds` key of `processConf`
     * 
     * @param {Function} dataHandler
     * 
     * @param {Function} cleanupHandler
     * 
     * @return {Object} processConf
     * 
     */
    function executeAction(name, action, dataHandler, cleanupHandler) {
        let prconf = getProcess(name);
        if (typeof action !== "string" || !prconf) {
            return false;
        }
        if (!!prconf.cmds[action]) {
            prconf.other["command"] = action;
            prconf.other["setprocess"] = true;
        }
        let cf = executeProcess(prconf, dataHandler, cleanupHandler);
        if (!!cf) {
            return cf;
        }
        return false;
    }


    /**
     * 
     * execCommandAsync
     * 
     * 
     * @param {String} exe
     * 
     * @param {Array Object} args
     * 
     * @param {Object} cmdOptions
     * 
     * @param {Function} dataHandler
     *
     */
    function execCommandAsync(exe, args, cmdOptions, dataHandler) {
        let ex = require('child_process').exec;
        return new Promise(function (resolve, reject) {
            ex([exe, ...args].join(" "), {}, function (err, stdout, stderr) {
                if (!!err) {
                    reject({ stdout: stdout, stderr: stderr });
                }
                resolve({ stdout: stdout, stderr: stderr });
            }.bind(args, resolve, reject));
        });
        // let ex = util.promisify(require('child_process').exec);
        // return ex([exe, ...args].join(" "), cmdOptions);
    }


    /**
     * 
     * TODO
     * startProcessAsync
     * All arguments and structure are the same but are async promises
     *
     * @param {Object} processConf
     * Defines the process Object needed to start the process
     * Expected Structure: {  }
     * 
     * process/server/database = 
     *  
     * @param {Function} dataHandler
     * 
     * @param {Function} cleanupHandler
     * 
     * @returns {Object}
     * { name: String, type: String, os: String, exe: String, cmds: { commandOject }, process: Object, options { shellOptions }, other: { otherOptions }, [..keyargs..] }
     * 
     * - [..keyargs..]: Other custom keys for use with datahandler or cleanuphandler
     * 
     * - <commandObject>: { start: { subcommandObject }, stop: { subcommandObject }, restart: { subcommandObject }, generic: { subcommandObject } }
     * - <shellOptions>: { stdio: String, shell: Boolean }
     * - <otherOptions>: { paths: { conf: String, exe: String }, env: String, setprocess: Boolean, executetype: String, command: String }
     * - <subcommandObject> [optionals: exe, modulePath, file]: { exe: String, modulePath: String, file: String, usage: String, args: Array }
     * 
     * @param {String} file
     * 
     * @param {Function} dataHandler
     * 
     * @param {Function} cleanupHandler
     * 
     * @returns {Object}
     * 
     */
    function startProcessAsync(processConf, file, dataHandler, cleanupHandler) {
        return false;
    }


    /**
     * 
     * TODO
     * execProcessAsync
     * 
     * 
     * @param {Object} conf
     * 
     * @param {Function} dataHandler
     *  
     * @returns {Boolean, Object}
     * false / Process Instance
     * 
     */
    function execProcessAsync(conf, dataHandler) {
        return new Promise(function (resolve, reject) {

        });
    }


    /**
     * 
     * killProcess
     * 
     * 
     * @param {String} name
     * 
     * @returns {Boolean}
     * 
     */
    function killProcess(name, signal) {
        try {
            let procConf = getProcess(name);
            let proc = procConf['process'];
            let setterVal = null;
            if (!!proc) {
                proc.kill(signal);
                proc.stdin.end();
                procConf['process'] = null;
            }
            setterVal = setter(processes, utils.convert.toObject( (name, procConf) ) );
            if (!setterVal) {
                console.error("killProcess: Error during setting object to null");
            }
            console.log('killProcess: Killed/Stopped process ' + name, "Object is ", processes[name]);
            return true;
        } catch (e) {
            return false;
        }
    }


    return {
        setup: setupHandler,
        os: {
            set: setOS,
            isValid: validOS,
            get: getOS
        },
        process: {
            set: setProcess,
            get: getProcess,
            registerHandlers: registerEventHandlers,
            exec: exec,
            execFile: execFile,
            fork: fork,
            spawn: spawn,
            executeProcess: executeProcess,
            executeAction: executeAction,
            kill: killProcess
        }
    }
}

module.exports = handler;
