import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {Invites, Planets} from './collectionsStandalone';
import {checkWritePermission} from "../util/checkPermissions";

export default Invites;

if (Meteor.isServer) {
  Meteor.publish('invites.invite', function findinvite(inviteId) {
    check(inviteId, String);

    return Invites.find({_id: inviteId});
  });
  Meteor.publish('invites.planet', function findplanet(inviteId) {
    check(inviteId, String);

    const invite = Invites.findOne(inviteId);

    if(invite) {
      return Planets.find({_id: invite.planet})
    }
  })
}

Meteor.methods({
  'invites.insert'(planetId) {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(checkWritePermission(this.userId, planet)) {
      Invites.insert({
        planet: planetId,
        owner: this.userId,
        createdAt: new Date()
      })
    }
  },
  'invites.use'(inviteId) {
    check(inviteId, String);

    const invite = Invites.findOne(inviteId);

    if(invite) {
      const planet = Planets.findOne(invite.planet)

      if(planet) {
        Planets.update(invite.planet, {$push: {members: this.userId}})
        Invites.remove(inviteId)
      }
    }
  }
})