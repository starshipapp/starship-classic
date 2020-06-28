import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {Wikis, Planets} from '../../collectionsStandalone';

export default Wikis;

if (Meteor.isServer) {
  Meteor.publish('wikis.wiki', function findwiki(wikiId) {
    check(wikiId, String)

    const wiki = Wikis.findOne(wikiId);
    if(wiki) {
      const planet = Planets.findOne(wiki.planet);

      if(planet && ((planet.private && planet.owner === this.userId) || !planet.private)) {
        return Wikis.find({_id: wikiId});
      }
    }
  });
}

