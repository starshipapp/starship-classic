import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Forums, Planets, ForumPosts, ForumReplies} from "../../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../../util/checkPermissions";

export default ForumReplies;

if (Meteor.isServer) {
  Meteor.publish("forumreplies.reply", function findreply(postId) {
    check(postId, String);

    const post = ForumPosts.findOne(postId);
    if(post) {
      const planet = Planets.findOne(post.planet);

      if(checkReadPermission(this.userId, planet)) {
        return ForumReplies.find({_id: postId});
      }
    }
  });
  Meteor.publish("forumreplies.replies", function findreplies(postId) {
    check(postId, String);

    const post = ForumPosts.findOne(postId);
    if(post) {
      const planet = Planets.findOne(post.planet);
      if (checkReadPermission(this.userId, planet)) {
        return ForumReplies.find({postId: postId});
      }
    }
  });
}

Meteor.methods({
  "forumreplies.insert"(postId, content) {
    check(postId, String);
    check(content, String);

    if(this.userId) {
      const post = ForumPosts.findOne(postId);
      if(post) {
        const planet = Planets.findOne(post.planet);

        if(checkReadPermission(this.userId, planet)) {
          ForumPosts.update(postId, {$set: {updatedAt: new Date()}});
          return ForumReplies.insert({
            postId: postId,
            componentId: post.componentId,
            content: content,
            owner: this.userId,
            planet: post.planet,
            reactions: [],
            stickied: false,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }
  },
  "forumreplies.update"(id, newContent) {
    check(newContent, String);
    check(id, String);

    if(this.userId) {
      const post = ForumReplies.findOne(id);
      const planet = Planets.findOne(post.planet);

      if(checkWritePermission(this.userId, planet) || this.userId === post.owner) {
        ForumReplies.update(id, {$set: {content: newContent}});
      }
    }
  }
});