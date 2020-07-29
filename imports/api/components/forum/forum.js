import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Forums, Planets} from "../../collectionsStandalone";
import {checkReadPermission} from "../../../util/checkPermissions";

export default Forums;

if (Meteor.isServer) {
  Meteor.publish("forums.forum", function findforum(forumId) {
    check(forumId, String);

    const forum = Forums.findOne(forumId);
    if(forum) {
      const planet = Planets.findOne(forum.planet);

      if(checkReadPermission(this.userId, planet)) {
        return Forums.find({_id: wikiId});
      }
    }
  });
}

