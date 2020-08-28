import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {check} from "meteor/check";

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

    return Meteor.users.find({_id: userId}, {fields: {username: 1, admin: 1}});
  });
  Meteor.publish("user.currentUserData", function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, {
        fields: { following: 1, admin: 1 }
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
      username: String
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

    Accounts.createUser(user);
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
  }
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() {return true;}
});
