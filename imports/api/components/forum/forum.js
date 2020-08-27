import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Forums, Planets} from "../../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../../util/checkPermissions";

export default Forums;

if (Meteor.isServer) {
  Meteor.publish("forums.forum", function findforum(forumId) {
    check(forumId, String);

    const forum = Forums.findOne(forumId);
    if(forum) {
      const planet = Planets.findOne(forum.planet);

      if(checkReadPermission(this.userId, planet)) {
        return Forums.find({_id: forumId});
      }
    }
  });
}

Meteor.methods({
  "forums.createtag"(id, tag) {
    check(id, String);
    check(tag, String);

    console.log(id);

    const forum = Forums.findOne(id);
    if(forum) {
      const planet = Planets.findOne(forum.planet);

      if(checkWritePermission(this.userId, planet) && ((forum.tags && !forum.tags.includes(tag)) || !forum.tags)) {
        Forums.update({_id: id}, {$push: {tags: tag}});
      }
    }
  },
  "forums.removetag"(id, tag) {
    check(id, String);
    check(tag, String);

    const forum = Forums.findOne(id);
    if(forum) {
      const planet = Planets.findOne(forum.planet);

      if(checkWritePermission(this.userId, planet)) {
        Forums.update({_id: id}, {$pull: {tags: tag}});
      }
    }
  }
});