import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import OutboundSmsButton from './OutboundSmsButton';
import OutboundSmsView from './OutboundSmsView';

const PLUGIN_NAME = 'OutboundSmsPlugin';

export default class OutboundSmsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }
  
  init(flex, manager) {
    // Check the task attribute and auto answer when needed
    // manager.workerClient.on('reservationCreated', reservation => {
    //   if (reservation.task.attributes.autoAnswer === true) {
    //     flex.Actions.invokeAction('AcceptTask', {sid: reservation.sid});
    //     //select the task
    //     flex.Actions.invokeAction('SelectTask', {sid: reservation.sid});
    //   }
    // });

    // adds the sms button to the navbar
    flex.SideNav.Content.add(<OutboundSmsButton key="nav-outbound-sms-button"/>);
    
    // get the JWE for authenticating the worker in our Function
    const jweToken = manager.store.getState().flex.session.ssoTokenPayload.token

    // adds the sms view
    flex.ViewCollection.Content.add(
      <flex.View name="sms" key="outbound-sms-view-parent">
        <OutboundSmsView key="outbound-sms-view" jweToken={jweToken} manager={manager} />
      </flex.View>
    );
  }
}
