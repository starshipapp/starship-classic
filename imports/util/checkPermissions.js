export function checkWritePermission(userId, planet) {
  if (userId && planet) {
    //we own it
    if (planet.owner === userId) {
      return true;
    }
    //we are a member of it
    if (planet.members && planet.members.contains(userId)) {
      return true;
    }
  }
  return false;
}

export function checkReadPermission(userId, planet) {
  if (userId && planet) {
    //planet is not private
    if (!planet.private) {
      return true;
    }
    //we are a member of it
    if (planet.members && planet.members.contains(userId)) {
      return true;
    }
    //we own it
    if (planet.owner === userId) {
      return true;
    }
  }
  return false;
}