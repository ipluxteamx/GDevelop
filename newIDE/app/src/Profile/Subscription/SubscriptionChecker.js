// @flow

import * as React from 'react';
import { Trans } from '@lingui/macro';
import FlatButton from '../../UI/FlatButton';
import Dialog, { DialogPrimaryButton } from '../../UI/Dialog';
import Star from '@material-ui/icons/Star';
import Favorite from '@material-ui/icons/Favorite';
import AuthenticatedUserContext from '../AuthenticatedUserContext';
import { Column, LargeSpacer, Line } from '../../UI/Grid';
import {
  sendSubscriptionCheckDialogShown,
  sendSubscriptionCheckDismiss,
} from '../../Utils/Analytics/EventSender';
import { SubscriptionSuggestionContext } from './SubscriptionSuggestionContext';
import Text from '../../UI/Text';

export type SubscriptionCheckerInterface = {|
  checkUserHasSubscription: () => boolean,
|};

type Props = {|
  title: React.Node,
  id:
    | 'Disable GDevelop splash at startup'
    | 'Debugger'
    | 'Hot reloading'
    | 'Preview over wifi',
  onChangeSubscription?: () => Promise<void> | void,
  mode: 'try' | 'mandatory',
|};

const styles = {
  icon: { width: 40, height: 40, marginRight: 20 },
  iconText: { flex: 1 },
};

const SubscriptionChecker = React.forwardRef<
  Props,
  SubscriptionCheckerInterface
>(({ mode, id, title, onChangeSubscription }, ref) => {
  const authenticatedUser = React.useContext(AuthenticatedUserContext);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const { openSubscriptionDialog } = React.useContext(
    SubscriptionSuggestionContext
  );

  const closeDialog = () => {
    sendSubscriptionCheckDismiss();
    setDialogOpen(false);
  };

  const checkUserHasSubscription = () => {
    if (authenticatedUser.subscription) {
      const hasPlan = !!authenticatedUser.subscription.planId;
      if (hasPlan) {
        setDialogOpen(false);
        return true;
      }
    }

    setDialogOpen(true);
    sendSubscriptionCheckDialogShown({ mode, id });

    return false;
  };

  React.useImperativeHandle(ref, () => ({ checkUserHasSubscription }));

  return (
    <Dialog
      open={dialogOpen}
      title={mode === 'try' ? <Trans>We need your support!</Trans> : title}
      actions={[
        <DialogPrimaryButton
          label={<Trans>Get a subscription or login</Trans>}
          key="subscribe"
          primary
          onClick={() => {
            if (onChangeSubscription) onChangeSubscription();
            setDialogOpen(false);
            openSubscriptionDialog({
              reason: id,
              preStep: 'subscriptionChecker',
            });
          }}
        />,
      ]}
      secondaryActions={[
        <FlatButton
          label={
            mode === 'try' ? (
              <Trans>Continue anyway</Trans>
            ) : (
              <Trans>Not now, thanks!</Trans>
            )
          }
          key="close"
          primary={false}
          onClick={closeDialog}
        />,
      ]}
      onRequestClose={closeDialog}
    >
      <Column noMargin>
        <Line noMargin alignItems="center">
          {mode === 'try' ? (
            <Text>
              <Trans>Please get a subscription to keep GDevelop running.</Trans>
            </Text>
          ) : (
            <Text>
              <Trans>
                To use this feature, you need a GDevelop subscription.
              </Trans>
            </Text>
          )}
        </Line>
        <Line noMargin alignItems="center">
          <Star style={styles.icon} />
          <Text style={styles.iconText}>
            <Trans>
              Get a subscription to gain more one-click exports, cloud projects,
              leaderboards and remove the GDevelop splashscreen.
            </Trans>
          </Text>
        </Line>
        <Line noMargin alignItems="center">
          <Favorite style={styles.icon} />
          <Text style={styles.iconText}>
            <Trans>
              You're also supporting the development of GDevelop, an open-source
              software! In the future, more online services will be available
              for users with a subscription.
            </Trans>
          </Text>
        </Line>
        <LargeSpacer />
        <Text align="right">
          <b>
            <Trans>Thanks!</Trans>
          </b>
        </Text>
      </Column>
    </Dialog>
  );
});

export default SubscriptionChecker;
