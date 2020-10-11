import {Mongo} from "meteor/mongo";

export const Planets = new Mongo.Collection("planets");
export const Pages = new Mongo.Collection("pages");
export const Wikis = new Mongo.Collection("wikis");
export const WikiPages = new Mongo.Collection("wikipages");
export const Invites = new Mongo.Collection("invites");
export const Files = new Mongo.Collection("files");
export const FileObjects = new Mongo.Collection("fileobjects");
export const Forums = new Mongo.Collection("forums");
export const ForumPosts = new Mongo.Collection("forumposts");
export const ForumReplies = new Mongo.Collection("forumreplies");
export const Reports = new Mongo.Collection("reports");
