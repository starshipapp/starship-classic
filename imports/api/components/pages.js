import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {Pages, Planets} from '../collectionsStandalone';

export default Pages;

if (Meteor.isServer) {
  Meteor.publish('pages.page', function findPage(pageId) {
    const page = Pages.findOne(pageId);
    if(page && this.userId) {
      const planet = Planets.findOne(page.planet);

      if(planet && ((planet.private && planet.owner === this.userId) || !planet.private)) {
        return Pages.find({_id: pageId});
      }
    }
  });
}

Meteor.methods({
  'pages.update'(id, newContent) {
    check(newContent, String);
    check(id, String);

    if(this.userId) {
      const page = Pages.findOne(id);
      const planet = Planets.findOne(page.planet);

      if(planet && planet.owner === this.userId) {
        Pages.update(id, {$set: {content: newContent}});
      }
    }
  }
});