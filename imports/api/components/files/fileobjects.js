import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Files, FileObjects, Planets} from "../../collectionsStandalone";
import {checkReadPermission} from "../../../util/checkPermissions";

export default FileObjects;

if (Meteor.isServer) {
  Meteor.publish("fileobjects.files", function findfiles(componentId, path) {
    check(componentId, String);
    check(path, String);

    const fileComponent = Files.findOne(componentId);

    if(fileComponent) {
      const planet = Planets.findOne(fileComponent.planet);

      if(checkReadPermission(this.userId, planet)) {
        return FileObjects.find({componentId: componentId, path: path, type: "files"});
      }
    }
  });
  Meteor.publish("fileobjects.folders", function findfolders(componentId, path) {
    check(componentId, String);
    check(path, String);

    const fileComponent = Files.findOne(componentId);

    if(fileComponent) {
      const planet = Planets.findOne(fileComponent.planet);

      if(checkReadPermission(this.userId, planet)) {
        return FileObjects.find({componentId: componentId, path: path, type: "folders"});
      }
    }
  });
  Meteor.publish("fileobjects.object", function findfiles(objectId) {
    check(objectId, String);

    const file = FileObjects.findOne(objectId);

    if(file) {
      const planet = Planets.findOne(file.planet);

      if(checkReadPermission(this.userId, planet)) {
        return FileObjects.find({_id: objectId});
      }
    }
  });
}

