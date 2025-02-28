// @flow
import { Trans } from '@lingui/macro';

import * as React from 'react';
import ObjectGroupsListWithObjectGroupEditor from '../../ObjectGroupsList/ObjectGroupsListWithObjectGroupEditor';
import { Tabs } from '../../UI/Tabs';
import EventsFunctionParametersEditor from './EventsFunctionParametersEditor';
import EventsFunctionPropertiesEditor from './EventsFunctionPropertiesEditor';
import ScrollView from '../../UI/ScrollView';
import { Column, Line } from '../../UI/Grid';
import { showWarningBox } from '../../UI/Messages/MessageBox';
import Window from '../../Utils/Window';
import { type GroupWithContext } from '../../ObjectsList/EnumerateObjects';
import { type UnsavedChanges } from '../../MainFrame/UnsavedChangesContext';

const gd: libGDevelop = global.gd;

type Props = {|
  project: gdProject,
  globalObjectsContainer: gdObjectsContainer,
  objectsContainer: gdObjectsContainer,
  eventsFunction: gdEventsFunction,
  eventsBasedBehavior: ?gdEventsBasedBehavior,
  eventsBasedObject: ?gdEventsBasedObject,
  eventsFunctionsContainer: gdEventsFunctionsContainer,
  onParametersOrGroupsUpdated: () => void,
  helpPagePath?: string,
  onConfigurationUpdated?: (whatChanged?: 'type') => void,
  renderConfigurationHeader?: () => React.Node,
  freezeParameters?: boolean,
  freezeEventsFunctionType?: boolean,
  onMoveFreeEventsParameter?: (
    eventsFunction: gdEventsFunction,
    oldIndex: number,
    newIndex: number,
    done: (boolean) => void
  ) => void,
  onMoveBehaviorEventsParameter?: (
    eventsBasedBehavior: gdEventsBasedBehavior,
    eventsFunction: gdEventsFunction,
    oldIndex: number,
    newIndex: number,
    done: (boolean) => void
  ) => void,
  onMoveObjectEventsParameter?: (
    eventsBasedObject: gdEventsBasedObject,
    eventsFunction: gdEventsFunction,
    oldIndex: number,
    newIndex: number,
    done: (boolean) => void
  ) => void,
  unsavedChanges?: ?UnsavedChanges,
  getFunctionGroupNames?: () => string[],
|};

type TabNames = 'config' | 'parameters' | 'groups';

type State = {|
  currentTab: TabNames,
|};

export default class EventsFunctionConfigurationEditor extends React.Component<
  Props,
  State
> {
  state = {
    currentTab: 'config',
  };

  _canObjectOrGroupUseNewName = (newName: string) => {
    const { objectsContainer, globalObjectsContainer } = this.props;

    if (
      objectsContainer.hasObjectNamed(newName) ||
      globalObjectsContainer.hasObjectNamed(newName) ||
      objectsContainer.getObjectGroups().has(newName) ||
      globalObjectsContainer.getObjectGroups().has(newName)
    ) {
      showWarningBox(
        'Another object or group with this name already exists in this function.',
        { delayToNextTick: true }
      );
      return false;
    } else if (!gd.Project.validateName(newName)) {
      showWarningBox(
        'This name is invalid. Only use alphanumeric characters (0-9, a-z) and underscores. Digits are not allowed as the first character.',
        { delayToNextTick: true }
      );
      return false;
    }

    return true;
  };

  _onDeleteGroup = (
    groupWithContext: GroupWithContext,
    done: boolean => void
  ) => {
    const { group } = groupWithContext;
    const {
      project,
      eventsFunction,
      globalObjectsContainer,
      objectsContainer,
    } = this.props;

    const answer = Window.showConfirmDialog(
      'Do you want to remove all references to this group in events (actions and conditions using the group)?'
    );

    gd.WholeProjectRefactorer.objectOrGroupRemovedInEventsFunction(
      project,
      eventsFunction,
      globalObjectsContainer,
      objectsContainer,
      group.getName(),
      /* isObjectGroup=*/ true,
      !!answer
    );
    done(true);
  };

  _onRenameGroup = (
    groupWithContext: GroupWithContext,
    newName: string,
    done: boolean => void
  ) => {
    const { group } = groupWithContext;
    const {
      project,
      eventsFunction,
      globalObjectsContainer,
      objectsContainer,
    } = this.props;

    // newName is supposed to have been already validated

    // Avoid triggering renaming refactoring if name has not really changed
    if (group.getName() !== newName) {
      gd.WholeProjectRefactorer.objectOrGroupRenamedInEventsFunction(
        project,
        eventsFunction,
        globalObjectsContainer,
        objectsContainer,
        group.getName(),
        newName,
        /* isObjectGroup=*/ true
      );
    }

    done(true);
  };

  _chooseTab = (currentTab: TabNames) =>
    this.setState({
      currentTab,
    });

  render() {
    const {
      project,
      globalObjectsContainer,
      objectsContainer,
      eventsFunction,
      eventsBasedBehavior,
      eventsBasedObject,
      freezeEventsFunctionType,
      onConfigurationUpdated,
      onParametersOrGroupsUpdated,
      freezeParameters,
      helpPagePath,
      renderConfigurationHeader,
      onMoveFreeEventsParameter,
      onMoveBehaviorEventsParameter,
      onMoveObjectEventsParameter,
      getFunctionGroupNames,
      eventsFunctionsContainer,
    } = this.props;

    return (
      <Column expand useFullHeight>
        <Line>
          <Column noMargin expand>
            <Tabs
              value={this.state.currentTab}
              onChange={this._chooseTab}
              options={[
                {
                  value: ('config': TabNames),
                  label: <Trans>Configuration</Trans>,
                },
                {
                  value: ('parameters': TabNames),
                  label: <Trans>Parameters</Trans>,
                },
                {
                  value: ('groups': TabNames),
                  label: <Trans>Object groups</Trans>,
                },
              ]}
            />
          </Column>
        </Line>
        {this.state.currentTab === 'config' ? (
          <ScrollView>
            <Line>
              <EventsFunctionPropertiesEditor
                project={project}
                eventsFunction={eventsFunction}
                eventsBasedBehavior={eventsBasedBehavior}
                eventsBasedObject={eventsBasedObject}
                eventsFunctionsContainer={eventsFunctionsContainer}
                helpPagePath={helpPagePath}
                onConfigurationUpdated={onConfigurationUpdated}
                renderConfigurationHeader={renderConfigurationHeader}
                freezeEventsFunctionType={freezeEventsFunctionType}
                getFunctionGroupNames={getFunctionGroupNames}
              />
            </Line>
          </ScrollView>
        ) : null}
        {this.state.currentTab === 'parameters' ? (
          <ScrollView>
            <Line>
              <EventsFunctionParametersEditor
                project={project}
                eventsFunction={eventsFunction}
                eventsBasedBehavior={eventsBasedBehavior}
                eventsBasedObject={eventsBasedObject}
                eventsFunctionsContainer={eventsFunctionsContainer}
                onParametersUpdated={onParametersOrGroupsUpdated}
                helpPagePath={helpPagePath}
                freezeParameters={freezeParameters}
                onMoveFreeEventsParameter={onMoveFreeEventsParameter}
                onMoveBehaviorEventsParameter={onMoveBehaviorEventsParameter}
                onMoveObjectEventsParameter={onMoveObjectEventsParameter}
                key={eventsFunction ? eventsFunction.ptr : null}
              />
            </Line>
          </ScrollView>
        ) : null}
        {this.state.currentTab === 'groups' ? (
          <ObjectGroupsListWithObjectGroupEditor
            project={project}
            globalObjectsContainer={globalObjectsContainer}
            objectsContainer={objectsContainer}
            globalObjectGroups={globalObjectsContainer.getObjectGroups()}
            objectGroups={eventsFunction.getObjectGroups()}
            canRenameGroup={this._canObjectOrGroupUseNewName}
            onRenameGroup={this._onRenameGroup}
            onDeleteGroup={this._onDeleteGroup}
            onGroupsUpdated={onParametersOrGroupsUpdated}
            canSetAsGlobalGroup={false}
            unsavedChanges={this.props.unsavedChanges}
          />
        ) : null}
      </Column>
    );
  }
}
