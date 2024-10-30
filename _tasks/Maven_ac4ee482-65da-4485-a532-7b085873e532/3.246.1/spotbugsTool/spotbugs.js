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
exports.AddSpotbugsPlugin = void 0;
// TODO: This file should be moved to the common package as a spotbugs tool
const tl = require("azure-pipelines-task-lib/task");
const utils_1 = require("../utils");
/**
 * Gets the plugin nodes and adds it to the original json schema. After that writes the schema to the POM file as XML
 * @param pomFile - POM file
 * @param pomJson - POM file json schema
 */
function addSpotbugsPluginData(pomFile, pomJson) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodes = addSpotbugsNodes(pomJson);
        pomJson.project.build[0].plugins = [nodes];
        return (0, utils_1.writeJsonAsXmlFile)(pomFile, pomJson);
    });
}
/**
 * Adds spotbugs nodes to the parent plugins node of the POM file json schema
 * @param pomJson - original json content of the POM file
 */
function addSpotbugsNodes(pomJson) {
    tl.debug('Adding the spotbugs data nodes');
    const buildNode = getBuildNode(pomJson);
    const pluginsNode = getPluginsNode(buildNode);
    const spotbugsPluginVersion = tl.getInput('spotBugsMavenPluginVersion');
    const isFailWhenFoundBugs = tl.getBoolInput('spotBugsFailWhenBugsFound', false);
    const spotbugsPluginArgs = {
        spotbugsPluginVersion: spotbugsPluginVersion,
        failOnError: isFailWhenFoundBugs
    };
    const content = getSpotbugsPluginJsonTemplate(spotbugsPluginArgs);
    (0, utils_1.addPropToJson)(pluginsNode, 'plugin', content);
    return pluginsNode;
}
/**
 * Gets the build node from the POM file json schema
 * @param pomJson - POM file json schema
 */
function getBuildNode(pomJson) {
    let buildNode = {};
    if (!pomJson.project.build || typeof pomJson.project.build === 'string') {
        pomJson.project.build = [buildNode];
    }
    else if (pomJson.project.build instanceof Array) {
        if (typeof pomJson.project.build[0] === 'string') {
            pomJson.project.build = [buildNode];
        }
        else {
            buildNode = pomJson.project.build[0];
        }
    }
    return buildNode;
}
/**
 * Returns the json schema of the spotbugs plugin for the Maven
 * Refers to: https://spotbugs.github.io/spotbugs-maven-plugin/usage.html#generate-spotbugs-report-as-part-of-the-project-reports
 * @param pluginArgs - arguments for configuring the spotbugs plugin
 * @returns Json schema of the spotbugs plugin
 */
function getSpotbugsPluginJsonTemplate(pluginArgs) {
    return {
        'groupId': ['com.github.spotbugs'],
        'artifactId': ['spotbugs-maven-plugin'],
        'version': [pluginArgs.spotbugsPluginVersion],
        'configuration': [
            {
                'failOnError': [pluginArgs.failOnError]
            }
        ]
    };
}
/**
 * Returns the plugin data node of the POM json schema
 * @param buildNode - build node of the POM config json schema
 */
function getPluginsNode(buildNode) {
    let pluginsNode = {};
    /* Always look for plugins node first */
    if (buildNode.plugins) {
        if (typeof buildNode.plugins === 'string') {
            buildNode.plugins = {};
        }
        if (buildNode.plugins instanceof Array) {
            if (typeof buildNode.plugins[0] === 'string') {
                pluginsNode = {};
                buildNode.plugins[0] = pluginsNode;
            }
            else {
                pluginsNode = buildNode.plugins[0];
            }
        }
        else {
            pluginsNode = buildNode.plugins;
        }
    }
    else {
        buildNode.plugins = {};
        pluginsNode = buildNode.plugins;
    }
    return pluginsNode;
}
/**
 * Impelements the Spotbugs plugin to the Project POM file
 */
function AddSpotbugsPlugin(mavenPOMFile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pomJson = yield (0, utils_1.readXmlFileAsJson)(mavenPOMFile);
            if (!pomJson.project) {
                throw new Error(tl.loc('InvalidBuildFile'));
            }
            tl.debug('Adding spotbugs plugin data');
            return yield addSpotbugsPluginData(mavenPOMFile, pomJson);
        }
        catch (err) {
            tl.error('Error when updating the POM file: ' + err);
            throw err;
        }
    });
}
exports.AddSpotbugsPlugin = AddSpotbugsPlugin;
