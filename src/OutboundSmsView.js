import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const smsCanvas = css`
  width: 300px;
  fontsize: 12px;
  margin-left: 15px;
  margin-right: 15px;
  padding: 15px 10px;
`
const input = css`
  width: 100%;
  textarea {
    padding: 6px 12px 7px 12px !important;
  }
`

export class OutboundSmsView extends React.Component {
  
  
  state = {
    Name: 'Jack Callan',
    To: '+13175136497',
    Email: 'JackCDemo@gmail.com',
    Crmid: '101',
    From: '+18573056207',
    Message: '',
    WorkerEmail: this.props.manager.workerClient.attributes.email,
    WorkerUri: this.props.manager.workerClient.attributes.contact_uri
  }

  // Calls a function to send an SMS using the Twilio SMS API
  startNotification(fromNumber, toNumber, smsMessage) {
    console.log ('----- Running startNotification -----');
    console.log(`Phone: ${toNumber} From: ${fromNumber} Message: ${smsMessage}`);
    console.log(`Calling Twilio Function: https://${this.props.manager.configuration.serviceBaseUrl}/send-sms`);
    const smsURL = `https://${this.props.manager.configuration.serviceBaseUrl}/send-sms?toNumber=${encodeURI(toNumber)}&message=${encodeURI(smsMessage)}`;
    fetch(smsURL)
      .then(result => result.json())
      .then(result => {
        console.log("SMS Sent");
        alert(`SMS Message has been sent to ${toNumber}.\nMessage: ${smsMessage}`);
        Actions.invokeAction('NavigateToView', {viewName: 'agent'})
      });
    }

  // Calls a function to create a task using FlexFlows (with Proxy and Chat Services)
  startChat(fromNumber, toName, toNumber, toEmail, toCrmid) {
    console.log ('----- Running startChat -----');
    console.log(`From: ${fromNumber} Name: ${toName} Number: ${toNumber} Email: ${toEmail} CRMID: ${toCrmid} Contact URI: ${this.state.WorkerUri}`);
    console.log(`Calling Twilio Function: https://${this.props.manager.configuration.serviceBaseUrl}/create-sms-chat`);
    const name = encodeURIComponent(toName);
    const phone = encodeURIComponent(toNumber);
    const email = encodeURIComponent(toEmail);
    const crmid = encodeURIComponent(toCrmid);
    const from = encodeURIComponent(fromNumber);
    const WorkerUri = encodeURIComponent(this.state.WorkerUri)
    const smsURL = `https://${this.props.manager.configuration.serviceBaseUrl}/create-sms-chat?fromNumber=${from}&toName=${name}&toNumber=${phone}&email=${email}&crmid=${crmid}&workerUri=${WorkerUri}`;
    fetch(smsURL)
      .then(result => result.json())
      .then(result => {
        console.log("Chat Started");
        // alert("SMS Chat has been started, you will find it in your task list.");
        // Actions.invokeAction('NavigateToView', {viewName: 'agent'})
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div css={smsCanvas}> 
        <React.Fragment> 
          <Grid container direction="column" spacing={3}>
            <Paper elevation={2} >
              <div css={smsCanvas}> 
                <Grid item xs={12}>
                  <p>Enter a mobile phone number </p>
                </Grid>
                <Grid item xs={12}>            
                <TextField
                    id='FromNumber'
                    label='From Number'
                    css={input}
                    value={this.state.From}
                    onChange={this.handleChange('From')}
                    margin='normal'
                    variant='outlined'
                  />
                  <TextField
                    id='Name'
                    label='Customer Name'
                    css={input}
                    value={this.state.Name}
                    onChange={this.handleChange('Name')}
                    margin='normal'
                    variant='outlined'
                  />
                  <TextField
                    id='To'
                    label='To (E.164 format)'
                    css={input}
                    value={this.state.To}
                    onChange={this.handleChange('To')}
                    margin='normal'
                    variant='outlined'
                  />
                  <TextField
                    id='Email'
                    label='Customer Email'
                    css={input}
                    value={this.state.Email}
                    onChange={this.handleChange('Email')}
                    margin='normal'
                    variant='outlined'
                  />
                  <TextField
                    id='CRM ID'
                    label='CRM ID'
                    css={input}
                    value={this.state.Crmid}
                    onChange={this.handleChange('Crmid')}
                    margin='normal'
                    variant='outlined'
                  />
                </Grid>                
                <br />
                <Grid item xs={12} >
                  <p>Presse the SMS Chat if you would like to start an SMS Chat Task.</p>
                  <br />
                  <Button variant='contained' color='primary' onClick={e => this.startChat(this.state.From, this.state.Name, this.state.To, this.state.Email, this.state.Crmid)}>Start Chat</Button>
                </Grid>
                <br />
                <Divider variant="middle" />
                <br />
                <Grid item xs={12} >
                  <p>Enter and message to send an outbound notification: </p>
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    id='Message'
                    label='Message'
                    multiline
                    rows='4'
                    css={input}
                    value={this.state.Message}
                    onChange={this.handleChange('Message')}
                    margin='normal'
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={12} >
                  <Button variant='contained' color='primary' onClick={e => this.startNotification(this.state.From, this.state.To, this.state.Message)}>Send Notification</Button>
                </Grid>
              </div>
            </Paper>
          </Grid>
        </React.Fragment>
      </div>
      
    )
  }
}

const mapStateToProps = state => {
  return {
    url: state.flex.config.serviceBaseUrl.slice(0,5) === 'https'
      ? (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)
      : ('https://' + (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl))
  }
}

export default connect(mapStateToProps)(OutboundSmsView);
