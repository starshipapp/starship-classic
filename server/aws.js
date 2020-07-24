import {Meteor} from "meteor/meteor";
import {WebApp} from "meteor/webapp";
import {check} from "meteor/check";

import {FileObjects, Files, Planets} from "../imports/api/collectionsStandalone";
import { checkWritePermission, checkReadPermission } from "../imports/util/checkPermissions";
import AWS, { S3 } from "aws-sdk";

const spacesEndpoint = new AWS.Endpoint(Meteor.settings.bucket.endpoint);
AWS.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: Meteor.settings.bucket.accessKey,
  secretAccessKey: Meteor.settings.bucket.accessKeySecret,
  s3ForcePathStyle: Meteor.settings.bucket.forcePathStyle
});

const s3 = new AWS.S3();

Meteor.methods({
  "aws.uploadfile"(folderId, type, name, filesId) {
    check(folderId, String);
    check(type, String);
    check(name, String);
    check(filesId, String);

    const folder = FileObjects.findOne(folderId);
    if(folder && folder.type === "folder" || folderId === "root") {
      let filesComponentId = filesId;
      if(folderId !== "root") {
        filesComponentId = folder.componentId;
      }
      const fileComponent = Files.findOne(filesComponentId);
      if(fileComponent) {
        const planet = Planets.findOne(fileComponent.planet);
        if(checkWritePermission(this.userId, planet)) {
          // generate file and signed url
          let filename = name.replace(/[/\\?%*:|"<>]/g, "-");
          let path = [...folder.path];
          path.push(folder._id);
          let documentId = FileObjects.insert({
            path: path,
            parent: path[path.length - 1],
            name: filename,
            planet: planet._id,
            componentId: filesComponentId,
            owner: this.userId,
            type: "file",
            fileType: type,
            finishedUploading: false
          });
          const url = s3.getSignedUrl("putObject", {
            Bucket: Meteor.settings.bucket.bucket,
            Key: fileComponent._id + "/" + folderId + "/" + documentId + "/" + filename,
            Expires: 120,
            ContentType: type,
          });
          FileObjects.update(documentId, {$set: {key: fileComponent._id + "/" + folderId + "/" + documentId + "/" + name}});
          return {url, documentId};
        }
      }
    }
  },
  "aws.downloadfile"(fileId) {
    check(fileId, String);
    const file = FileObjects.findOne(fileId);
    
    if(file && file.type === "file") {
      const planet = Planets.findOne(file.planet);
      if(checkReadPermission(this.userId, planet)) {
        const url = s3.getSignedUrl("getObject", {
          Bucket: Meteor.settings.bucket.bucket,
          Key: file.key,
          Expires: 120,
          ResponseContentDisposition: "attachment; filename=\"" + file.name + "\""
        });
        return url;
      }
    }
  },
  "aws.deletefile"(documentId) {
    check(documentId, String);
    let file = FileObjects.findOne(documentId);
    if(file) {
      let planet = Planets.findOne(file.planet);
      if(checkWritePermission(this.userId, planet)) {
        if(file.key) {
          s3.deleteObject({Bucket: Meteor.settings.bucket.bucket, Key: file.key});
        }
        if(file.type === "folder") {
          FileObjects.remove({path: file._id});
        }
        FileObjects.remove(file._id);
      }
    }
  }
});