"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishSpotbugsReport = void 0;
// TODO: This file should be moved to the common package as a spotbugs tool
const tl = require("azure-pipelines-task-lib/task");
const path = require("path");
const utils_1 = require("../utils");
const fs = require("fs");
/**
 * Publishes the spotbugs xml report file to the pipeline artifacts
 * @param buildOutput - Build output from a single or multi module project. Identifies modules based on path conventions.
 */
function PublishSpotbugsReport(buildOutput) {
    const moduleOutput = buildOutput.findModuleOutputs()[0];
    tl.debug(`[CA] Spotbugs parser found ${moduleOutput.moduleName} module to upload results from.`);
    const stagingDir = path.join(tl.getVariable('build.artifactStagingDirectory'), '.codeAnalysis');
    const artifactBaseDir = path.join(stagingDir, 'CA');
    const destinationDir = path.join(artifactBaseDir, moduleOutput.moduleName);
    if (!fs.existsSync(destinationDir)) {
        tl.debug(`Creating CA directory = ${destinationDir}`);
        fs.mkdirSync(destinationDir, { recursive: true });
    }
    const reportsPath = moduleOutput.moduleRoot;
    const reportFile = path.join(reportsPath, 'spotbugsXml.xml');
    tl.debug(`Spotbugs report file = ${reportFile}`);
    const buildNumber = tl.getVariable('build.buildNumber');
    const extension = path.extname(reportFile);
    const reportName = path.basename(reportFile, extension);
    const artifactName = `${buildNumber}_${reportName}_${'Spotbugs'}${extension}`;
    (0, utils_1.copyFile)(reportFile, path.join(destinationDir, artifactName));
    tl.command('artifact.upload', { 'artifactname': tl.loc('codeAnalysisArtifactSummaryTitle') }, artifactBaseDir);
}
exports.PublishSpotbugsReport = PublishSpotbugsReport;
