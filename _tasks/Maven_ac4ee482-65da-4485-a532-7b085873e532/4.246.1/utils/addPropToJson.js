"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPropToJson = void 0;
// TODO: This file should be moved to the common package as a spotbugs tool
const tl = require("azure-pipelines-task-lib/task");
/**
 * Add the property to the JSON object.
 *
 * Note: it mutates the original json object
 *
 * @param obj - Original JSON object.
 * @param propName - Name of the property to add.
 * @param value - Property value.
 */
function addPropToJson(obj, propName, value) {
    if (!obj) {
        obj = {};
    }
    if (obj instanceof Array) {
        const propNode = obj.find(o => o[propName]);
        if (propNode) {
            obj = propNode;
        }
    }
    const containsId = function (o) {
        if (value && value.id) {
            if (o.id instanceof Array) {
                return o.id.find((v) => {
                    return v === value.id;
                });
            }
            else {
                return value.id === o.id;
            }
        }
        return false;
    };
    if (propName in obj) {
        if (obj[propName] instanceof Array) {
            const existing = obj[propName].find(containsId);
            if (existing) {
                tl.warning(tl.loc('EntryAlreadyExists'));
                tl.debug('Entry: ' + value.id);
            }
            else {
                obj[propName].push(value);
            }
        }
        else if (typeof obj[propName] !== 'object') {
            obj[propName] = [obj[propName], value];
        }
        else {
            const prop = {};
            prop[propName] = value;
            obj[propName] = [obj[propName], value];
        }
    }
    else if (obj instanceof Array) {
        const existing = obj.find(containsId);
        if (existing) {
            tl.warning(tl.loc('EntryAlreadyExists'));
            tl.debug('Entry: ' + value.id);
        }
        else {
            const prop = {};
            prop[propName] = value;
            obj.push(prop);
        }
    }
    else {
        obj[propName] = value;
    }
}
exports.addPropToJson = addPropToJson;
