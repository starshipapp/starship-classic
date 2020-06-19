import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {check} from 'meteor/check'

if(Meteor.isServer) {
  Meteor.publish('users.findId', function findUserById(userId) {
    check(userId, String)

    return Meteor.users.find({_id: userId}, {fields: {username: 1}})
  })
}

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