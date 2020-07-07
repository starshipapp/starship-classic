import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Wikis, Planets} from "../../collectionsStandalone";
import {checkReadPermission} from "../../../util/checkPermissions";

export default Wikis;

if (Meteor.isServer) {
  Meteor.publish("wikis.wiki", function findwiki(wikiId) {
    check(wikiId, String);

    const wiki = Wikis.findOne(wikiId);
    if(wiki) {
      const planet = Planets.findOne(wiki.planet);

      if(checkReadPermission(this.userId, planet)) {
        return Wikis.find({_id: wikiId});
      }
    }
  });
}

