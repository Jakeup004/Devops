"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFile = exports.writeFile = exports.readFile = void 0;
const fs = require("fs");
const tl = require("azure-pipelines-task-lib/task");
const path = require("path");
const shelljs = require("shelljs");
/**
 * Reads the file from by the path
 * @param filePath - Path to the file
 * @param encoding - encoding of the file. Default is "utf-8"
 * @returns string representation of the content
 */
function readFile(filePath, encoding) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug(`Reading file at path: ${filePath}`);
            return new Promise((resolve, reject) => fs.readFile(filePath, (err, buffer) => {
                if (err) {
                    reject(err);
                }
                const fileData = buffer.toString(encoding !== null && encoding !== void 0 ? encoding : "utf-8");
                resolve(fileData);
            }));
        }
        catch (err) {
            tl.error(`Error when reading the file by path: ${filePath}`);
            throw err;
        }
    });
}
exports.readFile = readFile;
/**
 * Writes the content for the file by path
 * @param filePath - Path to the file to write
 * @param fileContent - Content of the file to write
 * @param encoding - Encoding for the file content
 */
function writeFile(filePath, fileContent, encoding) {
    try {
        const dirname = path.dirname(filePath);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }
        fs.writeFileSync(filePath, fileContent, { encoding: encoding !== null && encoding !== void 0 ? encoding : "utf-8" });
    }
    catch (err) {
        tl.error(`Error when writing to the file: ${err}`);
        throw err;
    }
}
exports.writeFile = writeFile;
/**
 * Copy the file to the destination path
 * @param sourcePath - Path to the source file
 * @param destinationPath - Path to the destination place
 */
function copyFile(sourcePath, destinationPath) {
    shelljs.cp('-f', sourcePath, destinationPath);
    const shellError = shelljs.error();
    if (shellError) {
        tl.error('cp failed');
        throw new Error(shellError);
    }
}
exports.copyFile = copyFile;
