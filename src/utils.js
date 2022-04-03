/*
License: MIT
Dynamic CGI serving using dynamic path imports for 
     CGI supporting executable for Interpreted languages Embedded Distribution
Contribution: 2018 Ganesh K. Bhat <ganeshsurfs@gmail.com> 
*/

const os = require("os");

/**
 *
 *
 * @returns
 * 
 */
function utils() {

    let osList = ["win32", "win64", "Windows_NT", "darwin", "unix", "linux", "fedora", "debian"];
    let executableOptionList = ["executable", "service", "file"];
    let processList = ["httpd", "tomcat", "mongoose", "putty", "nginx", "mysql", "pgsql", "top", "mysql", "mongodb", "pgsql"];
    let proxyPortRanges = [[8000, 9500], [10000, 15000]];
    let validProxyHandlers = ["error", "proxyReq", "proxyRes", "open", "data", "end", "close", "upgrade"];

    /**
     * 
     * setter
     * 
     *
     * @param { Object } setterObject
     * 
     * @param { Object } values
     * 
     * @returns
     * 
     */
    function setter(setterObject, values) {
        keys = Object.keys(values);
        if ((!values && typeof values !== "object") || (!keys.length)) { return false; }
        for (let i = 0; i < keys.length; i++) {
            setterObject[keys[i]] = values[keys[i]];
        }
        return setterObject;
    }


    /**
     * 
     * getter
     * 
     *
     * @param { Object } getterObject
     * 
     * @param { String, Array } args
     * 
     * @returns { Boolean }
     * 
     */
    function getter(getterObject, args) {
        if (!args) { return false; }
        if (typeof args === "string" || typeof args === "number") {
            return (!!getterObject[args]) ? getterObject[args] : false;
        } else if (Array.isArray(args)) {
            let tmp = {};
            for (let i = 0; i < args.length; i++) {
                if (!!getterObject[args[i]]) {
                    tmp[args[i]] = getterObject[args[i]];
                }
            }
            return (!Object.keys(tmp).length) ? false : tmp;
        }
        return false;
    }


    /**
     *
     *
     * @param { Object } options
     * 
     * @return { String } 
     */
    function convertObjectToString(options) {
        if (typeof options === "object") {
            let keys = options.keys(), str = " ";
            for (let i = 0; i < keys.length; i++) {
                str += " " + keys[i] + " " + options[keys[i]];
            }
            return str;
        } else if (typeof options === "string") {
            return options;
        } else {
            throw new Error("Options type not suitable");
        }
    }


    /**
     * Set/ Add the OS in the list of OS
     *
     * @param { String } obj
     * 
     * @return { Boolean } 
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
     * @param { String } name
     * 
     * @return { Boolean } 
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
     * @return { String } 
     */
    function getOS() {
        return os.type();
    }


    /**
     * Set/ Add the executableOption in the list of executableOptions
     *
     * @param { String } obj
     * 
     * @return { Boolean } 
     */
    function setExecutableOptionList(obj) {
        if (typeof obj == "string") {
            executableOptionList.push(obj)
            return true;
        }
        return false;
    }


    /**
     * Check if executableOption in the list of executableOptions
     * 
     * @param { String } name
     * 
     * @return { Boolean } 
     */
    function validExecutableOptionList(name) {
        if ((typeof obj == "string") && (executableOptionList.indexOf(name) !== -1)) {
            return name;
        }
        return false;
    }

    /**
     * Set/ Add the process in the list of processes
     *
     * @param { String } obj
     * 
     * @return { Boolean } 
     */
    function setProcessList(obj) {
        if (typeof obj == "string") {
            processList.push(obj)
            return true;
        }
        return false;
    }


    /**
     * Check if process in the list of processes
     * 
     * @param { String } name
     * 
     * @return { Boolean } 
     */
    function validProcessList(name) {
        if ((typeof name == "string") && (processList.indexOf(name) !== -1)) {
            return name;
        }
        return false;
    }

    /**
     * Set/ Add the validProxyHandler in the list of validProxyHandlers
     *
     * @param { String } name
     * 
     * @return { Boolean } 
     */
    function setValidProxyHandlers(name) {
        if (typeof name == "string") {
            validProxyHandlers.push(name)
            return true;
        }
        return false;
    }


    /**
     * Check if validProxyHandler in the list of validProxyHandlers
     * 
     * @param { String } name
     * 
     * @return { Boolean } 
     */
    function validValidProxyHandlers(name) {
        if ((typeof name == "string") && (validProxyHandlers.indexOf(name) !== -1)) {
            return name;
        }
        return false;
    }


    /**
     * Set/ Add the validProxyHandler in the list of validProxyHandlers
     *
     * @param { String } range
     * 
     * @return { Boolean } 
     * 
     */
    function setProxyPortRanges(range) {
        if (Array.isArray(range) && range.length === 2) {
            proxyPortRanges.push(range)
            return true;
        }
        return false;
    }


    /**
     * Check if proxyPortRange in the list of proxyPortRanges
     * 
     * @param { Array } range
     * range - [start, end]
     * 
     * @return { Boolean } 
     * 
     */
    function validProxyPortRanges(range) {

        return false;
    }

    /**
     *
     *
     * @param { Object } options
     * 
     * @return { Array } 
     */
    function createArray(options) {
        let arr = [], keys = Object.keys(options);
        if (typeof options === "object") {
            for (let i = 0; i < keys.length; i++) {
                arr.push("-" + keys[i]).push(options[keys[i]]);
            }
            return arr;
        } else if (typeof options === "string") {
            arr.push(options);
            return arr;
        } else {
            process.exit();
        }
    }


    /**
     *
     *
     * @param { Object } options
     * 
     * @return { Array } 
     */
    function convertObjectToArray(options) {
        let arr = [];
        if (typeof options === "object") {
            let keys = Object.keys(options);
            for (let i = 0; i < keys.length; i++) {
                arr.push([keys[i], options[keys[i]]]);
            }
            return arr;
        } else if (typeof options === "string") {
            arr.push(options);
            return arr;
        } else {
            return false;
        }
    }


    /**
     *
     *
     * @param { Object } baseObject
     * 
     * @param { Object | Array } validateObj
     * 
     * @param { Boolean } [exact=false]
     * 
     * @param { Boolean } [type=false]
     * 
     * @return {Boolean} 
     * 
     */
    function isEqual(baseObject, validateObj, exact = false, type = false) {
        let aProps = Object.getOwnPropertyNames(baseObject);
        let bProps = Object.getOwnPropertyNames(validateObj);

        if (!!exact) {
            if (aProps.length != bProps.length) {
                return false;
            }
        }
        for (let i = 0; i < aProps.length; i++) {
            if (!(bProps.includes(aProps[i]))) {
                return false;
            }
            if (typeof baseObject[aProps[i]] === "object" && !Array.isArray(baseObject[aProps[i]])) {
                isEqual(baseObject[aProps[i]], validateObj[aProps[i]], exact);
            }
            if (typeof baseObject[aProps[i]] === "object" && Array.isArray(baseObject[aProps[i]])) {
                // TODO: Do object checks here
            }
        }
        return true;
    }


    /**
     *
     *
     * @param { Array } baseArray
     * 
     * @param { String } name
     * 
     * @return { Boolean } 
     * 
     */
    function allowedListItem(baseArray, name) {
        return baseArray.includes(name);
    }


    /**
     *
     * error
     * 
     * @param { String } msg
     * 
     * @return {No Return | throw error}
     * 
     */
    function error(msg, allowExit) {
        console.error(msg);
        if (!!allowExit) {
            process.exit(msg);
        } else {
            throw new Error(msg);
        }
    }


    /**
     *
     *
     * @param { Number } pid
     * 
     * @return { Boolean } 
     * 
     */
    function is_running(pid) {
        try {
            return process.kill(pid, 0)
        }
        catch (e) {
            return e.code === 'EPERM'
        }
    }


    /**
     *
     *
     * @param { Array } arr
     * 
     * @param { Boolean } [override=true]
     * 
     * @param { String } [seperator="-*-"]
     * 
     * @return { Array } 
     * 
     */
    function convertArrayToObject(arr, override = true, seperator = "-*-") {
        const initialValue = {};
        let count = 0;
        return arr.reduce(function (obj, item) {
            if (override === false) {
                count += 1;
            }
            if (!obj[item[0].toString()]) {
                return {
                    ...obj,
                    [item[0].toString()]: item[1],
                };
            }
            return {
                ...obj,
                [item[0].toString() + seperator + count]: item[1],
            };
        }, initialValue);
    };


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function getFile(filename, options) {
        return fs.readFileSync(filename, { "encoding": "utf8", ...options, "flags": "rs" });
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function getJSONFile(filename, options) {
        return JSON.parse(getFile(filename, options));
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { Object } options
     * 
     * @param { String } [seperator=","]
     * 
     * @param { String } [linebreak="\n"]
     * 
     * @return {*} 
     */
    function getCSVFile(filename, options, seperator = ",", linebreak = "\n") {
        let str = getFile(filename, options);
        return convertCSVArrayToObject(str, seperator, linebreak);
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { String } data
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function setFile(filename, data, options) {
        return fs.writeFileSync(filename, data, { "encoding": "utf8", ...options, "flags": "w+" });
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { Object } data
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function setJSONFile(filename, data, options) {
        return setFile(filename, JSON.stringify(data), options);
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { String } data
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function setCSVFile(filename, data, options) {
        return setFile(filename, data, options);
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { String } data
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function appendFile(filename, data, options) {
        return fs.appendFileSync(filename, data, { "encoding": "utf8", ...options, "flags": "a+" });
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { String } data
     * 
     * @param { String } [options={ "encoding": "utf8" }]
     * 
     * @return {*} 
     */
    function appendCSV(filename, data, options) {
        // return appendFile(filename, data, { ...options, "flags": "a+" })
        return false;
    }


    /**
     *
     *
     * @param { String } filename
     * 
     * @param { Object } data
     * 
     * @param { Object } options
     * 
     * @return {*} 
     */
    function appendJSON(filename, data, options) {
        return appendFile(filename, JSON.stringify({
            ...getJSONFile(filename, {}),
            ...data
        }), options)
    }


    /**
     *
     *
     * @param { String } str
     * 
     * @param { String } [seperator=" "]
     * 
     * @param { String } [linebreak="\r\r\n"]
     * 
     * @return { Array } 
     * 
     */
    function convertCSVArrayToObject(str, seperator = " ", linebreak = "\n") {
        let result = str.split(linebreak).map((ai) => {
            return ai.split(seperator).filter((i) => { return !!i })
        });
        let headers = result[0], processArray = [];
        for (let i = 1; i < result.length; i++) {
            let o = {};
            for (let j = 0; j < headers.length; j++) {
                o[headers[j]] = result[i][j];
            }
            processArray.push(o)
        }
        return processArray;
    }


    return {
        executableOptions: {
            valid: validExecutableOptionList,
            set: setExecutableOptionList
        },
        os: {
            get: getOS,
            valid: validOS,
            set: setOS
        },
        processes: {
            valid: validProcessList,
            set: setProcessList
        },
        portRanges: {
            valid: validProxyPortRanges,
            set: setProxyPortRanges
        },
        proxyHandlers: {
            valid: validValidProxyHandlers,
            set: setValidProxyHandlers
        },
        file: {
            get: getFile,
            append: appendFile,
            set: setFile
        },
        csv: {
            get: getCSVFile,
            append: appendCSV,
            set: setCSVFile
        },
        json: {
            get: getJSONFile,
            set: setJSONFile,
            append: appendJSON
        },
        convert: {
            array: createArray,
            string: convertObjectToString,
            objectToArray: convertObjectToArray,
            arrayToObject: convertArrayToObject,
            csvToObject: convertCSVArrayToObject
        },
        allowedItem: allowedListItem,
        isEqual: isEqual,
        setter: setter,
        getter: getter,
        error: error,
        is_running: is_running
    }

}

module.exports = utils;
