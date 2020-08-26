import {Meteor} from "meteor/meteor";
//import {WebApp} from "meteor/webapp";
import {check} from "meteor/check";
//import s3Zip from "s3-zip";
import { uuid } from "uuidv4";

import {FileObjects, Files, Planets} from "../imports/api/collectionsStandalone";
import { checkWritePermission, checkReadPermission } from "../imports/util/checkPermissions";
import AWS from "aws-sdk";

let authenticatedRequests = {};

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
          let path = ["root"];
          if(folder) {
            path = [...folder.path];
            path.push(folder._id);
          }
          let documentId = FileObjects.insert({
            path: path,
            parent: path[path.length - 1],
            name: filename,
            planet: planet._id,
            componentId: filesComponentId,
            owner: this.userId,
            createdAt: new Date(),
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
          Expires: 3600,
          ResponseContentDisposition: "attachment; filename=\"" + file.name + "\""
        });
        return url;
      }
    }
  },
  "aws.getpreview"(fileId) {
    check(fileId, String);
    const file = FileObjects.findOne(fileId);
    
    if(file && file.type === "file") {
      const planet = Planets.findOne(file.planet);
      if(checkReadPermission(this.userId, planet)) {
        const url = s3.getSignedUrl("getObject", {
          Bucket: Meteor.settings.bucket.bucket,
          Key: file.key,
          Expires: 3600
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
          s3.deleteObject({Bucket: Meteor.settings.bucket.bucket, Key: file.key}, function(err) {
            if (err) console.log(err, err.stack);  // error
          });
        } else if(file.type === "folder") {
          //delete everything from s3
          let filesToCheck = FileObjects.find({path: file._id}).fetch();
          let keys = [[]];
          filesToCheck.map((value) => {
            if(value.key) {
              if(keys[keys.length - 1].length === 1000) {
                keys.push([]);
              }
              keys[keys.length - 1].push({Key: value.key});
            }
          });
          keys.map((value) => {
            s3.deleteObjects({Bucket: Meteor.settings.bucket.bucket, Delete: {Objects: value}}, function(err) {
              if (err) console.log(err, err.stack);  // error
            });
          });
          FileObjects.remove({path: file._id});
        }
        FileObjects.remove(file._id);
      }
    }
  },
  "aws.generatezipkey"(documentId) {
    check(documentId, String);
    let file = FileObjects.findOne(documentId);
    if(file && file.type === "folder") {
      let planet = Planets.findOne(file.planet);
      if(checkWritePermission(this.userId, planet)) {
        let currentUuid = uuid();
        authenticatedRequests[currentUuid] = {id: documentId, name: file.name.replace(/[/\\?%*:|"<>]/g, "-") + ".zip"};
        return currentUuid;
      }
    }
  },
  "aws.deletefilecomponent"(componentId) {
    check(componentId, String);
    let filesToCheck = FileObjects.find({componentId}).fetch();
    let keys = [[]];
    filesToCheck.map((value) => {
      if(value.key) {
        if(keys[keys.length - 1].length === 1000) {
          keys.push([]);
        }
        keys[keys.length - 1].push({Key: value.key});
      }
    });
    keys.map((value) => {
      s3.deleteObjects({Bucket: Meteor.settings.bucket.bucket, Delete: {Objects: value}}, function(err) {
        if (err) console.log(err, err.stack);  // error
      });
    });
    FileObjects.remove({componentId});
  }
});

/*WebApp.connectHandlers.use("/aws/downloadzip/", (req, res) => {
  let uuid = req.url.split("/")[1];
  if(authenticatedRequests[uuid]) {
    let files = FileObjects.find({parent: authenticatedRequests[uuid].id, type: "file", finishedUploading: true}).fetch();
    let name = authenticatedRequests[uuid].name;
    delete authenticatedRequests[uuid];
    let fileKeys = ["starship.nfo"];
    files.map((value) => {fileKeys.push(value.key);});
    if(fileKeys.length > 0) {
      res.setHeader("Content-Disposition", "filename=\"" + name + "\"");
      s3Zip
        .setFormat("tar")
        .archive({ s3: s3, bucket: Meteor.settings.bucket.bucket, debug: true}, "", fileKeys)
        .pipe(res);
    } else {
      res.writeHead(400);
      res.end("Invalid folder (no files)");
    }
  } else {
    res.writeHead(403);
    res.end("Invalid auth UUID");
  }
});*/