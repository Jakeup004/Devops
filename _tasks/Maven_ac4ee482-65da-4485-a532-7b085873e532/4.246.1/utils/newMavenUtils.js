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
exports.writeJsonAsXmlFile = exports.readXmlFileAsJson = void 0;
// TODO: This file should be moved to the common package as a spotbugs tool
const tl = require("azure-pipelines-task-lib/task");
const convertXmlToJson_1 = require("./convertXmlToJson");
const fileUtils_1 = require("./fileUtils");
const convertJsonToXml_1 = require("./convertJsonToXml");
const removeBom_1 = require("./removeBom");
/**
 * Reads the xml file and converts it to the json format
 * @param filePath Path to the xml file
 * @returns Json schema of the file content
 */
function readXmlFileAsJson(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const xml = yield (0, fileUtils_1.readFile)(filePath);
            const fixedXml = (0, removeBom_1.removeBom)(xml);
            const json = yield (0, convertXmlToJson_1.convertXmlToJson)(fixedXml);
            return json;
        }
        catch (err) {
            tl.error(`Error when reading xml file as json: ${err}`);
            throw err;
        }
    });
}
exports.readXmlFileAsJson = readXmlFileAsJson;
/**
 * Converts the json content to the xml format and writes it to the file
 * @param filePath Path to the file to be written
 * @param jsonContent Json content to write
 * @param rootName Refers to: https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class
 */
function writeJsonAsXmlFile(filePath, jsonContent, rootName) {
    tl.debug('Writing JSON as XML file: ' + filePath);
    try {
        const builderOpts = {
            renderOpts: {
                pretty: true
            },
            headless: true,
            rootName: rootName !== null && rootName !== void 0 ? rootName : 'root'
        };
        const xml = (0, convertJsonToXml_1.convertJsonToXml)(jsonContent, builderOpts);
        return (0, fileUtils_1.writeFile)(filePath, xml);
    }
    catch (err) {
        tl.error(`Error when writing the json to the xml file: ${err}`);
        throw err;
    }
}
exports.writeJsonAsXmlFile = writeJsonAsXmlFile;
