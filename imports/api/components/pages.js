import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Pages, Planets} from "../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../util/checkPermissions";

export default Pages;

if (Meteor.isServer) {
  Meteor.publish("pages.page", function findPage(pageId) {
    check(pageId, String);

    const page = Pages.findOne(pageId);
    if(page) {
      const planet = Planets.findOne(page.planet);

      if(checkReadPermission(this.userId, planet)) {
        return Pages.find({_id: pageId});
      }
    }
  });
}

Meteor.methods({
  "pages.update"(id, newContent) {
    check(newContent, String);
    check(id, String);

    if(this.userId) {
      const page = Pages.findOne(id);
      const planet = Planets.findOne(page.planet);

      if(checkWritePermission(this.userId, planet)) {
        Pages.update(id, {$set: {content: newContent}});
      }
    }
  }
});