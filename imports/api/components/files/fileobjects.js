import {Meteor} from "meteor/meteor";
import {check, Match} from "meteor/check";

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
}

Meteor.methods({
  "fileobjects.createfolder"(path, name, componentId) {
    Match.test(path, [String])
    check(name, String)
    check(componentId, String)

    if(this.userId) {
      const component = Files.findOne(componentId);
      console.log("a");
      if(component) {
        const planet = Planets.findOne(component.planet);
        console.log("b");
        if(checkWritePermission(this.userId, planet) && path.length > 0) {
          const parentObject = FileObjects.findOne(path[path.length - 1])
          console.log("c");
          console.log(path);
          console.log(parentObject);
          if(parentObject || (path.length === 1 && path[0] === "root")) {
            console.log("d");
            console.log(path);
            // this is a valid "enough" path, create the folder
            FileObjects.insert({
              path: path,
              parent: path[path.length - 1],
              name: name,
              planet: planet._id,
              componentId: componentId,
              type: "folder",
              fileType: "starship/folder"
            })
          }
        }
      }
    }
  }
})