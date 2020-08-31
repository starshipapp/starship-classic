import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {CreateComponent, Index, DeletionFunctions} from "./components/componentIndex";

import {Planets} from "./collectionsStandalone.js";
import {checkReadPermission, checkWritePermission, checkAdminPermission} from "../util/checkPermissions";

export default Planets;

if (Meteor.isServer) {
  Meteor.publish("planets.sidebar.memberOf", function planetsPublication() {
    if(this.userId) {
      return Planets.find({
        $or: [
          {owner: this.userId},
          {members: this.userId}
        ]
      }, {fields: {name: 1, owner: 1, members: 1}});
    }
  });
  Meteor.publish("planets.sidebar.following", function planetsPublication() {
    if(this.userId) {
      const user = Meteor.users.findOne(this.userId);
      if(user.following) {
        return Planets.find({_id: {$in: user.following}}, {fields: {name: 1}});
      }
    }
  });
  Meteor.publish("planets.featured", function planetsPublication() {
    if(this.userId) {
      return Planets.find({featured: true, private: false}, {fields: {name: 1, featuredDescription: 1, followerCount: 1, featured: 1}});
    }
  });
  Meteor.publish("planets.planet", function findPlanet(planetId) {
    check(planetId, String);
    const planet = Planets.findOne(planetId);
    if(checkReadPermission(this.userId, planet)) {
      return Planets.find({_id: planetId});
    }
  });
}

Meteor.methods({
  "planets.insert"(name) {
    check(name, String);

    if(this.userId) {
      return Planets.insert({
        name: name,
        createdAt: new Date(),
        owner: this.userId,
        private: false,
        followerCount: 0,
        components: []
      });
    }
  },
  "planets.addcomponent"(name, planetId, type) {
    check(name, String);
    check(planetId, String);
    check(type, String);

    const planet = Planets.findOne(planetId);

    if (checkWritePermission(this.userId, planet)) {
      if(Object.keys(Index).includes(type)) {
        let componentId = CreateComponent(type, planetId, this.userId, (a, documentId) => {
          Planets.update(planetId, {$push: {components: {name: name, componentId: documentId, type: type}}});
        });
        return componentId;
      }
    }
  },
  "planets.createhome"(planetId, type) {
    check(planetId, String);
    check(type, String);

    const planet = Planets.findOne(planetId);

    if (checkWritePermission(this.userId, planet)) {
      if(Object.keys(Index).includes(type)) {
        CreateComponent(type, planetId, this.userId, (a, documentId) => {
          Planets.update(planetId,{$set: {homeComponent: {componentId: documentId, type: type}}});
        });
      }
    }
  },
  "planets.togglefollow"(planetId) {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(checkReadPermission(this.userId, planet)){
      const user = Meteor.users.findOne(this.userId);
      if(user.following && user.following.includes(planet._id)) {
        Meteor.users.update(this.userId, {$pull: {following: planet._id}});
        Planets.update({_id: planetId}, {$inc: {followerCount: -1}});
      } else {
        Meteor.users.update(this.userId, {$push: {following: planet._id}});
        Planets.update({_id: planetId}, {$inc: {followerCount: 1}});
      }
    }
  },
  "planets.removecomponent"(planetId, componentId) {
    check(planetId, String);
    check(componentId, String);

    const planet = Planets.findOne(planetId);

    if (checkWritePermission(this.userId, planet)) {
      let filteredComponents = planet.components.filter(value => value.componentId === componentId);
      if(filteredComponents[0]) {
        DeletionFunctions[filteredComponents[0].type](componentId);
        Planets.update({_id: planetId}, {$pull: {components: {componentId: componentId}}});
      }
    }
  },
  "planets.updatename"(planetId, name) {
    check(planetId, String);
    check(name, String);

    const planet = Planets.findOne(planetId);

    if (checkWritePermission(this.userId, planet)) {
      Planets.update({_id: planetId}, {$set: {name: name}});
    }
  },
  "planets.toggleprivate"(planetId) {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(checkWritePermission(this.userId, planet)){
      Planets.update({_id: planetId}, {$set: {private: !planet.private}});
    }
  },
  "planets.removemember"(planetId, userId) {
    check(planetId, String);
    check(userId, String);

    const planet = Planets.findOne(planetId);

    if(checkWritePermission(this.userId, planet)){
      Planets.update({_id: planetId}, {$pull: {members: userId}});
    }
  },
  "planets.renamecomponent"(planetId, componentId, name) {
    check(planetId, String);
    check(componentId, String);
    check(name, String);
    
    const planet = Planets.findOne(planetId);

    if(checkWritePermission(this.userId, planet)) {
      Planets.update({_id: planetId, "components.componentId": componentId}, {$set: {"components.$.name": name}});
    }
  },
  "planets.applymodtools"(planetId, featured, verified, partnered, featuredDescription) {
    check(planetId, String);
    check(featuredDescription, String);
    check(featured, Boolean);
    check(verified, Boolean);
    check(partnered, Boolean);

    console.log("test");

    const planet = Planets.findOne(planetId);

    if(checkAdminPermission(this.userId) && planet) {
      console.log("test3");
      Planets.update({_id: planetId}, {$set: {featuredDescription, featured, verified, partnered}});
    }
  }
});