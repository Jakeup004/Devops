"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJsonToXml = void 0;
// TODO: This file should be moved to the common package as a spotbugs tool
const tl = require("azure-pipelines-task-lib/task");
const xml2js = require("xml2js");
/**
 * Convert the json content to the xml format
 * @param jsonContent - Json content, which will be converted
 * @param builderOpts - options for the bulder(converter) to the xml. See here the options: https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class
 * @returns string with the xml
 */
function convertJsonToXml(jsonContent, builderOpts) {
    tl.debug("Converting JSON to XML");
    try {
        const builder = new xml2js.Builder(builderOpts);
        const xmlContent = builder.buildObject(jsonContent).replace(/&#xD;/g, "");
        return xmlContent;
    }
    catch (err) {
        tl.error(`Error when converting the json to the xml: ${err}`);
        throw err;
    }
}
exports.convertJsonToXml = convertJsonToXml;
