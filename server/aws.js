import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {FileObjects, Files, Planets} from "./collectionsStandalone";
import { checkWritePermission } from "../imports/util/checkPermissions";
import AWS from "aws-sdk";

const spacesEndpoint = new AWS.Endpoint(Meteor.settings.bucket.endpoint);
AWS.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: Meteor.settings.bucket.accessKey,
  secretAccessKey: Meteor.settings.bucket.accessKeySecret,
  s3ForcePathStyle: Meteor.settings.bucket.forcePathStyle
});

const s3 = new AWS.S3();

Meteor.methods({
  "aws.generatesigned"(folderId, type, name) {
    check(folderId, String);
    check(type, String);
    check(name, String);

    const folder = FileObjects.findOne(folderId);
    if(folder && folder.type === "folder") {
      const fileComponent = Files.findOne(folder.componentId);
      if(fileComponent) {
        const planet = Planets.findOne(fileComponent.planet);
        if(checkWritePermission(this.userId, planet)) {
          // upload the file
          const url = s3.getSignedUrl("putObject", {
            Bucket: Meteor.settings.bucket.bucket,
            Key: fileComponent + "/" + folder + "/" + name,
            Expires: 60,
            ContentType: type,
          });
          return url;
        }
      }
    }
  }
})