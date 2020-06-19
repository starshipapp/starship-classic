import {Pages, Planets} from '../collectionsStandalone';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check'


export const Index = {
  page: Pages
}

export const CreationFunctions = {
  page: (planetId, userId, callback) => {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(planet) {
      if(planet.owner === userId) {
        return Pages.insert({
          createdAt: new Date(),
          owner: userId,
          planet: planetId,
          updatedAt: new Date(),
          content: "This is a Page. Click the Edit icon in the top right corner to get started."
        }, callback)
      }
    }
  }
}

export const FindComponent = function (type, id) {
  if(!Object.keys(Index).includes(type)) {
    return null
  }

  return Index[type].findOne(id)
}

export const CreateComponent = function (type, planetId, userId, callback) {
  if(!Object.keys(Index).includes(type)) {
    return null
  }

  return CreationFunctions[type](planetId, userId, callback);
}