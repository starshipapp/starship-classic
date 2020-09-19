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
  Meteor.publish("user.admin", function () {
    if (this.userId) {
      let user = Meteor.users.findOne(this.userId);

      if(user.admin) {
        return Meteor.users.find({});
      }
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
        let userId = Accounts.createUser(user);
        Accounts.sendVerificationEmail(userId);
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
  },
  "users.resendemail"(username) {
    check(username, String);

    let user = Meteor.users.findOne({username: username});

    if(user) {
      Accounts.sendVerificationEmail(user._id);
    }
  },
  "users.resetpassword"(username) {
    check(username, String);
    
    let user = Meteor.users.findOne({username: username});

    if(user) {
      Accounts.sendResetPasswordEmail(user._id);
    }
  }
});

Accounts.validateLoginAttempt(function(options) {
  /* options:
    type            (String)    The service name, such as "password" or "twitter".
    allowed         (Boolean)   Whether this login is allowed and will be successful.
    error           (Error)     When allowed is false, the exception describing why the login failed.
    user            (Object)    When it is known which user was attempting to login, the Meteor user object.
    connection      (Object)    The connection object the request came in on.
    methodName      (String)    The name of the Meteor method being used to login.
    methodArguments (Array)     An array of the arguments passed to the login method
  */

  // If the login has failed, just return false.
  if (!options.allowed) {
    return false;
  }

  // Check the user's email is verified. If users may have multiple 
  // email addresses (or no email address) you'd need to do something
  // more complex.
  if (options.user.emails[0].verified === true) {
    return true;
  } else {
    throw new Meteor.Error("email-not-verified", "You must verify your email address before you can log in");
  }

});


Accounts.emailTemplates.siteName = "Starship";
Accounts.emailTemplates.from = "noreply <noreply@starship.william341.me>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Welcome to Starship!";
  },
  text(user, url) {
    return `Welcome to Starship, ${user.username}!\n
You can verify your e-mail by following this link: ${url}`;
  }
};

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() {return true;}
});
