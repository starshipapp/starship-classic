import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {WikiPages, Planets, Wikis} from '../../collectionsStandalone';

export default WikiPages;

if (Meteor.isServer) {
  Meteor.publish('wikipages.wikipage', function findwikipage(wikipageId) {
    const wikipage = WikiPages.findOne(wikipageId);
    if(wikipage) {
      const planet = Planets.findOne(wikipage.planet);

      if(planet && ((planet.private && planet.owner === this.userId) || !planet.private)) {
        return WikiPages.find({_id: wikipageId});
      }
    }
  });
  Meteor.publish('wikipages.findpages', function findwikipages(wikiId) {
    const wiki = Wikis.findOne(wikiId);
    if(wiki) {
      const planet = Planets.findOne(wiki.planet);

      if(planet && ((planet.private && planet.owner === this.userId) || !planet.private)) {
        return WikiPages.find({wikiId: wikiId});
      }
    }
  })
}

Meteor.methods({
  'wikipages.insert'(wikiId, content, name) {
    check(wikiId, String);
    check(content, String);
    check(name, String);

    if(this.userId) {
      const wiki = Wikis.findOne(wikiId);
      if(wiki) {
        const planet = Planets.findOne(wiki.planet);

        if(planet && planet.owner === this.userId) {
          WikiPages.insert({
            name: name,
            wikiId: wikiId,
            content: content,
            planet: wiki.planet,
            createdAt: new Date()
          })
        }
      }
    }
  },
  'wikipages.update'(id, newContent) {
    check(newContent, String);
    check(id, String);

    if(this.userId) {
      const page = WikiPages.findOne(id);
      const planet = Planets.findOne(page.planet);

      if(planet && planet.owner === this.userId) {
        WikiPages.update(id, {$set: {content: newContent}});
      }
    }
  }
});