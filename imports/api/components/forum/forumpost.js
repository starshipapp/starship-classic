import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";

import {Forums, Planets, ForumPosts, ForumReplies} from "../../collectionsStandalone";
import {checkReadPermission, checkWritePermission} from "../../../util/checkPermissions";

import emoji from "node-emoji-new";

export default ForumPosts;

if (Meteor.isServer) {
  Meteor.publish("forumposts.post", function findpost(postId) {
    check(postId, String);

    const post = ForumPosts.findOne(postId);
    if(post) {
      const planet = Planets.findOne(post.planet);

      if(checkReadPermission(this.userId, planet)) {
        return ForumPosts.find({_id: postId});
      }
    }
  });
  Meteor.publish("forumposts.posts", function findposts(forumId) {
    check(forumId, String);

    const forum = Forums.findOne(forumId);
    if(forum) {
      const planet = Planets.findOne(forum.planet);
      if (checkReadPermission(this.userId, planet)) {
        return ForumPosts.find({componentId: forumId, planet: planet._id});
      }
    }
  });
}

Meteor.methods({
  // eslint-disable-next-line meteor/audit-argument-checks
  "forumposts.insert"(forumId, content, name, tag) {
    check(forumId, String);
    check(content, String);
    check(name, String);

    if(this.userId) {
      const forum = Forums.findOne(forumId);
      if(forum) {
        const planet = Planets.findOne(forum.planet);
        let tags = [];

        if(tag !== null) {
          check(tag, String);
          tags.push(tag);
        }

        if(checkReadPermission(this.userId, planet)) {
          return ForumPosts.insert({
            name: name,
            componentId: forumId,
            content: content,
            owner: this.userId,
            planet: forum.planet,
            tags: tags,
            reactions: [],
            replyCount: 0,
            stickied: false,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }
  },
  "forumposts.update"(id, newContent) {
    check(newContent, String);
    check(id, String);

    if(this.userId) {
      const post = ForumPosts.findOne(id);
      const planet = Planets.findOne(post.planet);

      if(checkWritePermission(this.userId, planet) || this.userId === post.owner) {
        ForumPosts.update(id, {$set: {content: newContent}});
      }
    }
  },
  "forumposts.delete"(id) {
    check(id, String);

    if(this.userId) {
      const post = ForumPosts.findOne(id);
      const planet = Planets.findOne(post.planet);

      if(checkWritePermission(this.userId, planet) || this.userId === post.owner) {
        ForumPosts.remove(id);
        ForumReplies.remove({postId: id});
      }
    }
  },
  "forumposts.sticky"(id) {
    check(id, String);

    if(this.userId) {
      const post = ForumPosts.findOne(id);
      if(post) {
        const planet = Planets.findOne(post.planet);

        if(checkWritePermission(this.userId, planet)) {
          ForumPosts.update(id, {$set: {stickied: !post.stickied}});
        }
      }
    }
  },
  "forumposts.lock"(id) {
    check(id, String);

    if(this.userId) {
      const post = ForumPosts.findOne(id);
      if(post) {
        const planet = Planets.findOne(post.planet);

        if(checkWritePermission(this.userId, planet)) {
          //we don't know if this post has the variable or not
          ForumPosts.update(id, {$set: {locked: post.locked ? false : true}});
        }
      }
    }
  },
  "forumposts.react"(reactEmoji, id) {
    check(reactEmoji, String);
    check(id, String);

    if(this.userId) {
      const post = ForumPosts.findOne(id);
      const planet = Planets.findOne(post.planet);
      if(checkReadPermission(this.userId, planet) && emoji.hasEmoji(reactEmoji)) {
        let reaction = post.reactions.find(value => value.emoji === reactEmoji);
        if(reaction) {
          if(reaction.reactors.includes(this.userId)) {
            if(reaction.reactors.length === 1) {
              ForumPosts.update(id, {$pull: {reactions: reaction}});
            } else {
              ForumPosts.update({_id: id, reactions: {$elemMatch: {emoji: reactEmoji}}}, {$pull: {"reactions.$.reactors": this.userId}});
            }
          } else {
            ForumPosts.update({_id: id, reactions: {$elemMatch: {emoji: reactEmoji}}}, {$push: {"reactions.$.reactors": this.userId}});
          }
        } else {
          ForumPosts.update(id, {$push: {reactions: {emoji: reactEmoji, reactors: [this.userId]}}});
        }
      }
    }
  }
});