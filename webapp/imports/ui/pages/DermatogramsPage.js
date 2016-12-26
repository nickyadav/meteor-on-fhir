import React  from 'react';
import ReactMixin  from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { GlassCard } from '/imports/ui/components/GlassCard';
import { CardTitle, CardText } from 'material-ui/Card';
import { VerticalCanvas } from '/imports/ui/components/VerticalCanvas';

import { Meteor } from 'meteor/meteor';
import Glass from '/imports/ui/Glass';


export class DermatogramsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {},
      state: {}
    };

    if (Meteor.user()) {
      data.state.isLoggedIn = true;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("DermatogramsPage[data]", data);
    return data;
  }


  render() {
    return (
      <div id="dermatogramsPage"> <VerticalCanvas>
          <GlassCard>
            <CardTitle
              title="Dermatograms"
            />
            <CardText>

            </CardText>
          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}



ReactMixin(DermatogramsPage.prototype, ReactMeteorData);
