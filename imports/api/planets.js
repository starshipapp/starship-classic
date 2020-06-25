import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {CreateComponent, Index} from './components/componentIndex';

import {Planets} from './collectionsStandalone.js';

export default Planets;

if (Meteor.isServer) {
  Meteor.publish('planets.sidebar.memberOf', function planetsPublication() {
    if(this.userId) {
      return Planets.find({
        $or: [
          {owner: this.userId}
        ]
      }, {fields: {name: 1, owner: 1}});
    }
  });
  Meteor.publish('planets.sidebar.following', function planetsPublication() {
    if(this.userId) {
      return Planets.find({
        $or: [
          {followers: this.userId}
        ]
      }, {fields: {name: 1, followers: 1}});
    }
  });
  Meteor.publish('planets.planet', function findPlanet(planetId) {
    check(planetId, String);
    const planet = Planets.findOne(planetId);
    if(planet && (planet.private && planet.owner === this.userId) || !planet.private) {
      return Planets.find({_id: planetId});
    }
  });
}

Meteor.methods({
  'planets.insert'(name) {
    check(name, String);

    if(this.userId) {
      Planets.insert({
        name: name,
        createdAt: new Date(),
        owner: this.userId,
        private: false,
        followers: [],
        components: []
      });
    }
  },
  'planets.addcomponent'(name, planetId, type) {
    check(name, String);
    check(planetId, String);
    check(type, String);

    const planet = Planets.findOne(planetId);

    if (planet.owner === this.userId) {
      if(Object.keys(Index).includes(type)) {
        CreateComponent(type, planetId, this.userId, (a, documentId) => {
          Planets.update(planetId, {$push: {components: {name: name, componentId: documentId, type: type}}});
        });
      }
    }
  },
  'planets.createhome'(planetId, type) {
    check(planetId, String);
    check(type, String);

    const planet = Planets.findOne(planetId);

    if (planet.owner === this.userId) {
      if(Object.keys(Index).includes(type)) {
        CreateComponent(type, planetId, this.userId, (a, documentId) => {
          Planets.update(planetId,{$set: {homeComponent: {componentId: documentId, type: type}}});
        });
      }
    }
  },
  'planets.togglefollow'(planetId) {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(planet && this.userId){
      if(planet.followers.includes(this.userId)) {
        Planets.update({_id: planetId}, {$pull: {followers: this.userId}});
      } else {
        Planets.update({_id: planetId}, {$push: {followers: this.userId}});
      }
    }
  },
  'planets.removecomponent'(planetId, componentId) {
    check(planetId, String);
    check(componentId, String);

    const planet = Planets.findOne(planetId);

    if (planet.owner === this.userId) {
      Planets.update({_id: planetId}, {$pull: {components: {componentId: componentId}}});
    }
  },
  'planets.updatename'(planetId, name) {
    check(planetId, String);
    check(name, String);

    const planet = Planets.findOne(planetId);

    if (planet.owner === this.userId) {
      Planets.update({_id: planetId}, {$set: {name: name}});
    }
  }
});