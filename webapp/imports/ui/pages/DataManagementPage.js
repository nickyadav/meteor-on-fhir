// https://www.npmjs.com/package/react-dropzone-component
// http://www.dropzonejs.com/


import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { GlassCard } from '/imports/ui/components/GlassCard';
import { VerticalCanvas } from '/imports/ui/components/VerticalCanvas';
import DropzoneComponent from 'react-dropzone-component';
import { Table } from 'react-bootstrap';
import Spacer from '/imports/ui/components/Spacer';
import { CardTitle, CardText } from 'material-ui/Card';

import { CollectionManagement } from '/imports/ui/components/CollectionManagement';

import { GeneticAlgorithms } from '/imports/api/genotype/GeneticAlgorithms';
import { Statistics } from '/imports/api/statistics/statistics';

var componentConfig = {
  allowedFiletypes: ['.jpg', '.png', '.gif'],
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: false,
  postUrl: '/uploadHandler'
};
var djsConfig = {
  autoProcessQueue: false,
  addRemoveLinks: true
};
var eventHandlers = {
  // This one receives the dropzone object as the first parameter
  // and can be used to additional work with the dropzone.js
  // object
  init: null,
  // All of these receive the event as first parameter:
  drop: function(){
    console.log("Drop!");
  },
  dragstart: null,
  dragend: null,
  dragenter: null,
  dragover: null,
  dragleave: null,
  // All of these receive the file as first parameter:
  addedfile: function (file) {
    console.log("Received a file; sending server.");

    // well, we received a file; lets take a peek inside to figure out what to do with it
    var reader = new FileReader();

    reader.onload = function(e) {
      fileContent = reader.result;
      fileContentArray = fileContent.split('\n');

      // hey, the first line mentions 23andMe; lets assume that it's a patient's raw data
      // and send it to the server for processing
      if (fileContentArray[0].includes("23andMe")) {
        console.log("This appears to be a 23andMe datafile!");

        Meteor.call("parseGenome", fileContent, function (error, result){
          if (error){
            console.log("error", error);
          }
          if (result){
            console.log("result", result);
          }
        });

      }
    }
    reader.readAsText(file);
  },
  removedfile: null,
  thumbnail: null,
  error: null,
  processing: null,
  uploadprogress: null,
  sending: null,
  success: null,
  complete: null,
  canceled: null,
  maxfilesreached: null,
  maxfilesexceeded: null,
  // All of these receive a list of files as first parameter
  // and are only called if the uploadMultiple option
  // in djsConfig is true:
  processingmultiple: null,
  sendingmultiple: null,
  successmultiple: null,
  completemultiple: null,
  canceledmultiple: null,
  // Special Events
  totaluploadprogress: null,
  reset: null,
  queuecomplete: null
};

Session.setDefault('showServerCounts', false);

export class DataManagementPage extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      user: {
        isAdmin: false
      },
      collections: {
        patients: Patients.find().count(),
        practitioners: Practitioners.find().count(),
        observations: Observations.find().count(),
        devices: Devices.find().count(),
        medications: Medications.find().count(),
        questionnaires: Questionnaires.find().count(),
        conditions: Conditions.find().count()
      },
      title: "Client Collections"
    };

    // if (Session.get('showServerCounts')) {
    //   var stats = Statistics.find({}, {limit: 1, sort: {date: -1}}).fetch();
    //   data.collections = stats[0].counts;
    // }


    let user = Meteor.user();
    if (user && user.roles) {
      user.roles.forEach(function(role){
        if (role === "sysadmin") {
          data.user.isAdmin = true;
        } else if (role === "practitioner") {
          data.user.isPractitioner = true;
        } else if (role === "patient") {
          data.user.isPatient = true;
        }
      });
    }

    return data;
  }
  render(){
    return(
      <div id="dataManagementPage">
        <VerticalCanvas >
          <GlassCard>
            <CardTitle
              title="Data Management"
            />
            <CardText>
              <DropzoneComponent
                config={componentConfig}
                 eventHandlers={eventHandlers}
                 djsConfig={djsConfig}
              />

            </CardText>
          </GlassCard>

          {this.renderAdminTiles(this.data.user)}

        </VerticalCanvas>
      </div>
    );
  }

  callMethod(signature){
    console.log("callMethod", signature);

    Meteor.call(signature);
  }

    renderAdminTiles(user){
      if (user.isAdmin || user.isPractitioner || user.isPatient) {
        return (
          <div>
            <Spacer />
            <GlassCard>
              <CardTitle
                title="Collections"
              />
              <CardText>
                <CollectionManagement />

              </CardText>
            </GlassCard>

          </div>
        );
      }
    }
}


ReactMixin(DataManagementPage.prototype, ReactMeteorData);
