// @flow
import { Trans } from '@lingui/macro';

import React from 'react';
import RaisedButton from '../../UI/RaisedButton';
import { Column, Line } from '../../UI/Grid';
import { findGDJS } from '../../GameEngineFinder/LocalGDJSFinder';
import LocalFileSystem, { type UrlFileDescriptor } from './LocalFileSystem';
import LocalFolderPicker from '../../UI/LocalFolderPicker';
import assignIn from 'lodash/assignIn';
import {
  type ExportPipeline,
  type ExportPipelineContext,
} from '../ExportPipeline.flow';
import optionalRequire from '../../Utils/OptionalRequire';
import { ExplanationHeader, DoneFooter } from '../GenericExporters/HTML5Export';
import { downloadUrlsToLocalFiles } from '../../Utils/LocalFileDownloader';
const electron = optionalRequire('electron');
const shell = electron ? electron.shell : null;

const gd: libGDevelop = global.gd;

type ExportState = {
  outputDir: string,
};

type PreparedExporter = {|
  exporter: gdjsExporter,
  localFileSystem: LocalFileSystem,
|};

type ExportOutput = {|
  urlFiles: Array<UrlFileDescriptor>,
|};

type ResourcesDownloadOutput = null;

type CompressionOutput = null;

export const localHTML5ExportPipeline: ExportPipeline<
  ExportState,
  PreparedExporter,
  ExportOutput,
  ResourcesDownloadOutput,
  CompressionOutput
> = {
  name: 'local-html5',

  getInitialExportState: (project: gdProject) => ({
    outputDir: project.getLastCompilationDirectory(),
  }),

  canLaunchBuild: exportState => !!exportState.outputDir,

  isNavigationDisabled: () => false,

  renderHeader: ({ project, exportState, updateExportState }) => (
    <Column noMargin>
      <Line>
        <ExplanationHeader />
      </Line>
      <Line>
        <LocalFolderPicker
          type="export"
          value={exportState.outputDir}
          defaultPath={project.getLastCompilationDirectory()}
          onChange={outputDir => {
            updateExportState(() => ({ outputDir }));
            project.setLastCompilationDirectory(outputDir);
          }}
          fullWidth
        />
      </Line>
    </Column>
  ),

  renderLaunchButtonLabel: () => <Trans>Export as a HTML5 game</Trans>,

  prepareExporter: (
    context: ExportPipelineContext<ExportState>
  ): Promise<PreparedExporter> => {
    return findGDJS().then(({ gdjsRoot }) => {
      console.info('GDJS found in ', gdjsRoot);

      // TODO: Memory leak? Check for other exporters too.
      const localFileSystem = new LocalFileSystem({
        downloadUrlsToLocalFiles: true,
      });
      const fileSystem = assignIn(
        new gd.AbstractFileSystemJS(),
        localFileSystem
      );
      const exporter = new gd.Exporter(fileSystem, gdjsRoot);

      return {
        exporter,
        localFileSystem,
      };
    });
  },

  launchExport: async (
    context: ExportPipelineContext<ExportState>,
    { exporter, localFileSystem }: PreparedExporter
  ): Promise<ExportOutput> => {
    const exportOptions = new gd.MapStringBoolean();
    exporter.exportWholePixiProject(
      context.project,
      context.exportState.outputDir,
      exportOptions
    );
    exportOptions.delete();
    exporter.delete();

    return {
      urlFiles: localFileSystem.getAllUrlFilesIn(context.exportState.outputDir),
    };
  },

  launchResourcesDownload: async (
    context: ExportPipelineContext<ExportState>,
    { urlFiles }: ExportOutput
  ): Promise<ResourcesDownloadOutput> => {
    await downloadUrlsToLocalFiles({
      urlContainers: urlFiles,
      onProgress: context.updateStepProgress,
      throwIfAnyError: true,
    });

    return null;
  },

  launchCompression: (
    context: ExportPipelineContext<ExportState>,
    exportOutput: ResourcesDownloadOutput
  ): Promise<CompressionOutput> => {
    return Promise.resolve(null);
  },

  renderDoneFooter: ({ exportState, onClose }) => {
    const openExportFolder = () => {
      if (shell) shell.openPath(exportState.outputDir);
    };

    return (
      <DoneFooter
        renderGameButton={() => (
          <RaisedButton
            fullWidth
            primary
            onClick={() => openExportFolder()}
            label={<Trans>Open the exported game folder</Trans>}
          />
        )}
      />
    );
  },
};
