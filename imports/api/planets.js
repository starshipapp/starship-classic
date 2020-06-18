import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check'

import {FindComponent, CreateComponent, Index} from './components/componentIndex'

import {Planets} from './collectionsStandalone.js';

export default Planets

if (Meteor.isServer) {
  Meteor.publish('planets.sidebar.memberOf', function planetsPublication() {
    return Planets.find({
      $or: [
        {owner: this.userId}
      ]
    }, {fields: {name: 1, owner: 1}});
  });
  Meteor.publish('planets.sidebar.following', function planetsPublication() {
    return Planets.find({
      $or: [
        {owner: this.userId}
      ]
    }, {fields: {name: 1, following: 1}});
  });
  Meteor.publish('planets.planet', function findPlanet(planetId) {
    const planet = Planets.findOne(planetId);

    if((planet.private && planet.owner == this.userId) || !planet.private) {
      return Planets.find({_id: planetId})
    }
  });
}

Meteor.methods({
  'planets.insert'(name) {
    check(name, String)

    Planets.insert({
      name: name,
      createdAt: new Date(),
      owner: this.userId,
      private: false,
      followers: [],
      components: []
    })
  },
  'planets.addcomponent'(name, planetId, type, componentId) {
    check(name, String)
    check(componentId, String)
    check(type, String)

    if(FindComponent(type, componentId)) {
      const planet = Planets.findOne(planetId)

      if (planet.owner === this.userId) {
        planet.update({$push: {components: {name: name, componentId: componentId, type: type}}})
      }
    }
  },
  'planets.createhome'(planetId, type) {
    check(planetId, String)
    check(type, String)

    const planet = Planets.findOne(planetId)

    if (planet.owner === this.userId) {
      if(Object.keys(Index).includes(type)) {
        CreateComponent(type, planetId, this.userId, (a, documentId) => {
          Planets.update(planetId,{$set: {homeComponent: {componentId: documentId, type: type}}})
        })
      }
    }
  }
})