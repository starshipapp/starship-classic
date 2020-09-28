import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Planets, ForumPosts, ForumReplies} from "../../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../../util/checkPermissions";

import emoji from "node-emoji-new";

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
        return ForumReplies.find({postId: postId}, {fields: {postId: 1, createdAt: 1}});
      }
    }
  });
  Meteor.publish("forumreplies.page", function findreplies(postId, page) {
    check(postId, String);
    check(page, Number);

    const post = ForumPosts.findOne(postId);
    if(post) {
      const planet = Planets.findOne(post.planet);
      if (checkReadPermission(this.userId, planet)) {
        return ForumReplies.find({postId: postId}, {sort: { createdAt: 1 }, skip: (page - 1) * 25 , limit: 25});
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

        if(checkReadPermission(this.userId, planet) && (!post.locked || checkWritePermission(this.userId, planet))) {
          ForumPosts.update(postId, {$set: {updatedAt: new Date()}, $inc: {replyCount: 1}});
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
  },
  "forumreplies.delete"(id) {
    check(id, String);

    if(this.userId) {
      const post = ForumReplies.findOne(id);
      const planet = Planets.findOne(post.planet);

      if(checkWritePermission(this.userId, planet) || this.userId === post.owner) {
        ForumReplies.remove(id);
        ForumPosts.update(post.postId, {$inc: {replyCount: -1}});
      }
    }
  },
  "forumreplies.react"(reactEmoji, id) {
    check(reactEmoji, String);
    check(id, String);

    if(this.userId) {
      const post = ForumReplies.findOne(id);
      const planet = Planets.findOne(post.planet);
      if(checkReadPermission(this.userId, planet) && (emoji.hasEmoji(reactEmoji) || reactEmoji === "largecrushed")) {
        let reaction = post.reactions.find(value => value.emoji === reactEmoji);
        if(reaction) {
          if(reaction.reactors.includes(this.userId)) {
            if(reaction.reactors.length === 1) {
              ForumReplies.update(id, {$pull: {reactions: reaction}});
            } else {
              ForumReplies.update({_id: id, reactions: {$elemMatch: {emoji: reactEmoji}}}, {$pull: {"reactions.$.reactors": this.userId}});
            }
          } else {
            ForumReplies.update({_id: id, reactions: {$elemMatch: {emoji: reactEmoji}}}, {$push: {"reactions.$.reactors": this.userId}});
          }
        } else {
          ForumReplies.update(id, {$push: {reactions: {emoji: reactEmoji, reactors: [this.userId]}}});
        }
      }
    }
  }
});