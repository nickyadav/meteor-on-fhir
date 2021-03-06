import React  from 'react';
import ReactMixin  from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import TextField from 'material-ui/TextField';
import { VerticalCanvas } from '/imports/ui/components/VerticalCanvas';
import { MobilePadding } from '/imports/ui/components/MobilePadding';

import { browserHistory } from 'react-router';

import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import RaisedButton from 'material-ui/RaisedButton';
import { lightBaseTheme, darkBaseTheme } from 'material-ui/styles';

import Theme from '/imports/ui/Theme';

export class Signin extends React.Component {
  getMeteorData() {
    let data = {
      style: Theme.palette()
    };

    if(process.env.NODE_ENV === "test") console.log("Signin[data]", data);
    return data;
  }
  handleSubmit(event) {
    event.preventDefault();
  }
  forgotPasswordRoute(){
    browserHistory.push('/recover-password');
  }
  handleTouchTap(){
    if(process.env.NODE_ENV === "test") console.log("this", this);
    let self = this;

    Meteor.loginWithPassword(
      this.refs.emailAddress.input.value,
      this.refs.password.input.value,
    function(error) {
      if (error) {
        Bert.alert(error.reason, 'warning');
      } else {
        Bert.alert('Logged in!', 'success');

        if (self.props.state && self.props.state.nextPathname) {
          browserHistory.push(location.state.nextPathname);
        } else {
          browserHistory.push('/');
        }
      }
    });
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleTouchTap(e);
    }
  }
  render() {
    return (
      <div id="signinPage">
        <MobilePadding>
          <VerticalCanvas>
            <h4 className="page-header" style={this.data.style.textColor}>Sign In</h4>
            <form ref="signin" className="signin">
              <TextField
                type="email"
                ref="emailAddress"
                name="emailAddress"
                placeholder="Email Address"
                inputStyle={this.data.style.inputStyle}
                hintStyle={this.data.style.hintStyle}
                errorStyle={this.data.style.errorStyle}
                underlineFocusStyle={this.data.style.underlineFocusStyle}
                floatingLabelStyle={this.data.style.floatingLabelStyle}
                floatingLabelFocusStyle={this.data.style.floatingLabelFocusStyle}
                onKeyPress={this.handleKeyPress.bind(this)}
              />
              <br/>
              <TextField
                type="password"
                ref="password"
                name="password"
                placeholder="Password"
                inputStyle={this.data.style.inputStyle}
                hintStyle={this.data.style.hintStyle}
                errorStyle={this.data.style.errorStyle}
                underlineFocusStyle={this.data.style.underlineFocusStyle}
                floatingLabelStyle={this.data.style.floatingLabelStyle}
                floatingLabelFocusStyle={this.data.style.floatingLabelFocusStyle}
                onKeyPress={this.handleKeyPress.bind(this)}
              />
              <br/>
              <br/>
              <br/>
              <br/>
              <RaisedButton id="signinButton" onTouchTap={this.handleTouchTap.bind(this)} label="Signin" primary={true} />
              <RaisedButton id="forgotPasswordButton" onTouchTap={this.forgotPasswordRoute } label="Forgot password?" style={{marginLeft: "20px"}} />
            </form>

          </VerticalCanvas>
        </MobilePadding>
      </div>
    );
  }
}
ReactMixin(Signin.prototype, ReactMeteorData);
