import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {check} from "meteor/check";
import { checkAdminPermission } from "../util/checkPermissions";
import axios from "axios";

Accounts.config({
  defaultFieldSelector: {
    username: 1,
    emails: 1,
    admin: 1,
    profile: 1,
    services: 1
  }
});

if(Meteor.isServer) {
  Meteor.publish("users.findId", function findUserById(userId) {
    check(userId, String);

    return Meteor.users.find({_id: userId}, {fields: {username: 1, admin: 1, createdAt: 1, banned: 1, profilePicture: 1}});
  });
  Meteor.publish("user.currentUserData", function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, {
        fields: { following: 1, admin: 1, banned: 1, profilePicture: 1 }
      });
    } else {
      this.ready();
    }
  });
}

Meteor.methods({
  "users.insert"(user) {
    check(user, {
      email: String,
      password: String,
      profile: {},
      username: String,
      recaptcha: String
    });

    const usernameExists = Accounts.findUserByUsername(user.username);
    const emailExists = Accounts.findUserByEmail(user.email);

    if(usernameExists) {
      throw new Meteor.Error("That username is taken");
    }

    if(emailExists) {
      throw new Meteor.Error("That email is taken");
    }

    if(user.password.length < 8) {
      throw new Meteor.Error("Your password must be at least 8 characters long");
    }

    let secret = Meteor.settings.recaptchaSecret;
    let response = user.recaptcha;

    axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
      },
    ).then((res) => {
      if(res.data.success === true) {
        Accounts.createUser(user);
      }
    });
  },
  /*"users.setadmin"(id) {
    check(id, String);

    Meteor.users.update({_id: id}, {$set: {admin: true}});
  },*/
  "users.getadmin"(id) {
    check(id, String);
    
    let user = Meteor.users.findOne(id);

    if(user) {
      return user.admin;
    }
  },
  "users.toggleban"(id) {
    check(id, String);

    let user = Meteor.users.findOne(id);

    if(user && checkAdminPermission(this.userId)) {
      Meteor.users.update(id, {$set: {banned: !user.banned}});
    }
  }
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() {return true;}
});
