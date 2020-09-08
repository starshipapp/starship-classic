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
        return FileObjects.find({componentId: componentId, parent: parent, type: "file", finishedUploading: true});
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
            return FileObjects.insert({
              path: path,
              parent: path[path.length - 1],
              name: name,
              planet: planet._id,
              owner: this.userId,
              createdAt: new Date(),
              componentId: componentId,
              type: "folder",
              fileType: "starship/folder"
            });
          }
        }
      }
    }
  },
  "fileobjects.completeupload"(documentId) {
    check(documentId, String);

    let file = FileObjects.findOne(documentId);
    if(file && file.owner === this.userId) {
      FileObjects.update(documentId, {$set: {finishedUploading: true}});
    }
  },
  "fileobjects.renamefile"(documentId, newName) {
    check(documentId, String);
    check(newName, String);

    let file = FileObjects.findOne(documentId);
    if(file) {
      let planet = Planets.findOne(file.planet);
      if(checkWritePermission(this.userId, planet)) {
        let name = newName.replace(/[/\\?%*:|"<>]/g, "-");
        FileObjects.update(documentId, {$set: {name}});
      }
    }
  },
  "fileobjects.moveobject"(objectId, newParentId) {
    check(objectId, String);
    check(newParentId, String);

    if(newParentId !== objectId) {
      let object = FileObjects.findOne(objectId);
      let newParent = FileObjects.findOne(newParentId);
      if(object && (newParent || newParentId === "root")) {
        let planet = Planets.findOne(object.planet);
        if(checkWritePermission(this.userId, planet)) {
          if(object.type === "file") {
            let newPath = newParent ? newParent.path.concat([newParent._id]) : ["root"];
            let newObjectParent = newParent ? newParent._id : "root";
            FileObjects.update(objectId, {$set: {path: newPath, parent: newObjectParent}});
          } else if (object.type === "folder") {
            let newPath = newParent ? newParent.path.concat([newParent._id]) : ["root"];
            let newObjectParent = newParent ? newParent._id : "root";
            FileObjects.update({path: object._id}, {$pull: {path: {$in: object.path}}}, {multi: true}, () => {
              FileObjects.update({path: object._id}, {$push: {path: {$each: newPath, $position: 0}}}, {multi: true});
              FileObjects.update(objectId, {$set: {path: newPath, parent: newObjectParent}});
            });
          }
        }
      }
    }
  }
});