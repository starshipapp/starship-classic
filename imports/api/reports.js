import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Reports} from "./collectionsStandalone";
import {checkAdminPermission} from "../util/checkPermissions";

export default Reports;

if (Meteor.isServer) {
  Meteor.publish("reports.report", function findReport(reportId) {
    check(reportId, String);

    if(checkAdminPermission(this.userId)) {
      return Reports.find({_id: reportId});
    }
  });
  Meteor.publish("reports.page", function findReports(page) {
    check(page, Number);
    
    if(checkAdminPermission(this.userId)) {
      return Reports.find({}, {sort: { createdAt: -1 }, skip: (page - 1) * 25 , limit: 100});
    }
  });
  Meteor.publish("reports.owner", function findReports(owner) {
    check(owner, String);
    
    if(checkAdminPermission(this.userId)) {
      return Reports.find({owner});
    }
  });
  Meteor.publish("reports.page.user", function findReports(userId) {
    check(userId, String);
    
    if(checkAdminPermission(this.userId)) {
      return Reports.find({userId});
    }
  });
}

Meteor.methods({
  "reports.insert"(planetId, objectType, objectId, reportType, details, userId) {
    check(planetId, String);
    check(objectType, Number);
    check(objectId, String);
    check(reportType, Number);
    check(details, String);
    check(userId, String);

    Reports.insert({
      planet: planetId,
      owner: this.userId,
      createdAt: new Date(),
      objectType,
      objectId,
      reportType,
      details,
      userId,
      solved: true
    });
  },
  "reports.solve"(reportId) {
    check(reportId, String);

    let report = Reports.findOne(reportId);

    if(report) {
      Reports.update(reportId, {$set: {solved: true}});
    }
  }
});
