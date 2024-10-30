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
exports.convertXmlToJson = void 0;
// TODO: This file should be moved to the common package as a spotbugs tool
const xml2js = require("xml2js");
const tl = require("azure-pipelines-task-lib/task");
/**
 * Converts the xml content to the json format
 * @param xmlContent - xml content, which will be converted
 * @returns the json schema object
 */
function convertXmlToJson(xmlContent) {
    return __awaiter(this, void 0, void 0, function* () {
        tl.debug("Converting XML to JSON");
        try {
            const jsonContent = yield xml2js.parseStringPromise(xmlContent);
            return jsonContent;
        }
        catch (err) {
            tl.error(`Error when conveting the xml to json: ${err}`);
            throw err;
        }
    });
}
exports.convertXmlToJson = convertXmlToJson;
