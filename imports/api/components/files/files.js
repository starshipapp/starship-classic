import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Files, Planets} from "../../collectionsStandalone";
import {checkReadPermission} from "../../../util/checkPermissions";

export default Files;

// Files are often refered to as a generic component in this code.
// This is to differentiate the component from the actual files,
// which are stored in the FileObjects collection (fileobjects.js)

if (Meteor.isServer) {
  Meteor.publish("files.filecomponent", function findcomponent(componentId) {
    check(componentId, String);

    const fileComponent = Files.findOne(componentId);
    if(fileComponent) {
      const planet = Planets.findOne(fileComponent.planet);

      if(checkReadPermission(this.userId, planet)) {
        return Files.find({_id: componentId});
      }
    }
  });
}

