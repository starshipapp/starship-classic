import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {WikiPages, Planets, Wikis} from "../../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../../util/checkPermissions";

export default WikiPages;

if (Meteor.isServer) {
  Meteor.publish("wikipages.wikipage", function findwikipage(wikipageId) {
    check(wikipageId, String);

    const wikipage = WikiPages.findOne(wikipageId);
    if(wikipage) {
      const planet = Planets.findOne(wikipage.planet);

      if(checkReadPermission(this.userId, planet)) {
        return WikiPages.find({_id: wikipageId});
      }
    }
  });
  Meteor.publish("wikipages.findpages", function findwikipages(wikiId) {
    check(wikiId, String);
    const wiki = Wikis.findOne(wikiId);
    if(wiki) {
      const planet = Planets.findOne(wiki.planet);

      if(checkReadPermission(this.userId, planet)) {
        return WikiPages.find({wikiId: wikiId}, {fields: {name: 1, wikiId: 1}});
      }
    }
  });
}

Meteor.methods({
  "wikipages.insert"(wikiId, content, name) {
    check(wikiId, String);
    check(content, String);
    check(name, String);

    if(this.userId) {
      const wiki = Wikis.findOne(wikiId);
      if(wiki) {
        const planet = Planets.findOne(wiki.planet);

        if(checkWritePermission(this.userId, planet)) {
          return WikiPages.insert({
            name: name,
            wikiId: wikiId,
            content: content,
            planet: wiki.planet,
            createdAt: new Date()
          });
        }
      }
    }
  },
  "wikipages.update"(id, newContent) {
    check(newContent, String);
    check(id, String);

    if(this.userId) {
      const page = WikiPages.findOne(id);
      const planet = Planets.findOne(page.planet);

      if(checkWritePermission(this.userId, planet)) {
        WikiPages.update(id, {$set: {content: newContent}});
      }
    }
  }
});