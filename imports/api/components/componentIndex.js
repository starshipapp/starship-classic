import {Pages, Planets, Wikis, Files, WikiPages, FileObjects} from "../collectionsStandalone";
import {check} from "meteor/check";
import { checkWritePermission } from "../../util/checkPermissions";


export const Index = {
  page: Pages,
  wiki: Wikis,
  files: Files
};

export const CreationFunctions = {
  page: (planetId, userId, callback) => {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(planet) {
      if(checkWritePermission(userId, planet)) {
        return Pages.insert({
          createdAt: new Date(),
          owner: userId,
          planet: planetId,
          updatedAt: new Date(),
          content: "This is a Page. Click the Edit icon in the top right corner to get started."
        }, callback);
      }
    }
  },
  wiki: (planetId, userId, callback) => {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(planet) {
      if(checkWritePermission(userId, planet)) {
        return Wikis.insert({
          createdAt: new Date(),
          owner: userId,
          planet: planetId,
          updatedAt: new Date()
        }, callback);
      }
    }
  },
  files: (planetId, userId, callback) => {
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(planet) {
      if(checkWritePermission(userId, planet)) {
        return Files.insert({
          createdAt: new Date(),
          owner: userId,
          planet: planetId,
          updatedAt: new Date()
        }, callback);
      }
    }
  }
};

export const DeletionFunctions = {
  wiki: (componentId) => {
    Wikis.remove(componentId);
    WikiPages.remove({wikiId: componentId});
  },
  files: (componentId) => {
    Files.remove(componentId);
    FileObjects.remove({componentId});
  },
  page: (componentId) => {
    Pages.remove(componentId);
  }
};

export const FindComponent = function (type, id) {
  if(!Object.keys(Index).includes(type)) {
    return null;
  }

  return Index[type].findOne(id);
};

export const CreateComponent = function (type, planetId, userId, callback) {
  if(!Object.keys(Index).includes(type)) {
    return null;
  }

  return CreationFunctions[type](planetId, userId, callback);
};