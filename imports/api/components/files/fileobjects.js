import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Files, FileObjects, Planets} from "../../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../../util/checkPermissions";

export default FileObjects;

if (Meteor.isServer) {
  Meteor.publish("fileobjects.files", function findfiles(componentId, parent) {
    check(componentId, String);
    check(parent, String);

    const fileComponent = Files.findOne(componentId);

    if(fileComponent) {
      const planet = Planets.findOne(fileComponent.planet);

      if(checkReadPermission(this.userId, planet)) {
        return FileObjects.find({componentId: componentId, parent: parent, type: "file"});
      }
    }
  });
  Meteor.publish("fileobjects.folders", function findfolders(componentId, parent) {
    check(componentId, String);
    check(parent, String);

    const fileComponent = Files.findOne(componentId);

    if(fileComponent) {
      const planet = Planets.findOne(fileComponent.planet);

      if(checkReadPermission(this.userId, planet)) {
        return FileObjects.find({componentId: componentId, parent: parent, type: "folder"});
      }
    }
  });
  Meteor.publish("fileobjects.object", function findobject(objectId) {
    check(objectId, String);

    const file = FileObjects.findOne(objectId);

    if(file) {
      const planet = Planets.findOne(file.planet);

      if(checkReadPermission(this.userId, planet)) {
        return FileObjects.find({_id: objectId});
      }
    }
  });
  Meteor.publish("fileobjects.objectslist", function findobjectIds(objectIds, planetId) {
    check(objectIds, [String]);
    check(planetId, String);

    const planet = Planets.findOne(planetId);

    if(checkReadPermission(this.userId, planet)) {
      return FileObjects.find({_id: {$in: objectIds}, planet: planetId});
    }
  });
}

Meteor.methods({
  "fileobjects.createfolder"(path, name, componentId) {
    check(name, String);
    check(componentId, String);
    check(path, [String]);

    if(this.userId) {
      const component = Files.findOne(componentId);
      if(component) {
        const planet = Planets.findOne(component.planet);
        if(checkWritePermission(this.userId, planet) && path.length > 0) {
          const parentObject = FileObjects.findOne(path[path.length - 1]);
          if(parentObject || (path.length === 1 && path[0] === "root")) {
            // this is a valid "enough" path, create the folder
            FileObjects.insert({
              path: path,
              parent: path[path.length - 1],
              name: name,
              planet: planet._id,
              componentId: componentId,
              type: "folder",
              fileType: "starship/folder"
            });
          }
        }
      }
    }
  }
});