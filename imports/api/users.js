import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {check} from 'meteor/check'

Meteor.methods({
  'users.insert'(user) {
    check(user, {
      email: String,
      password: String,
      profile: {},
      username: String
    })

    const usernameExists = Accounts.findUserByUsername(user.username)
    const emailExists = Accounts.findUserByEmail(user.email)

    if(usernameExists) {
      throw new Meteor.Error('used-username');
    }

    if (emailExists) {
      throw new Meteor.Error('used-email');
    }

    Accounts.createUser(user);
  }
})