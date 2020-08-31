export function checkWritePermission(userId, planet) {
  if (userId && planet) {
    //admin check
    let user = null;

    user = Meteor.users.findOne(userId);

    if(user && user.admin) {
      return true;
    }

    //we own it
    if (planet.owner === userId) {
      return true;
    }
    //we are a member of it
    if (planet.members && planet.members.includes(userId)) {
      return true;
    }
  }
  return false;
}

export function checkReadPermission(userId, planet) {
  if (planet) {
    //admin check
    let user = null;

    user = Meteor.users.findOne(userId);

    if(user && user.admin) {
      return true;
    }

    //planet is not private
    if (!planet.private) {
      return true;
    }
    //we are a member of it
    if (userId && planet.members && planet.members.includes(userId)) {
      return true;
    }
    //we own it
    if (userId && planet.owner === userId) {
      return true;
    }
  }
  return false;
}

export function checkAdminPermission(userId) {
  //admin check
  let user = null;

  user = Meteor.users.findOne(userId, {fields: { following: 1, admin: 1 }});

  console.log(user);
  
  if(user && user.admin) {
    return true;
  }
}