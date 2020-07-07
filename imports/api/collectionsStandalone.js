import {Mongo} from "meteor/mongo";

export const Planets = new Mongo.Collection("planets");
export const Pages = new Mongo.Collection("pages");
export const Wikis = new Mongo.Collection("wikis");
export const WikiPages = new Mongo.Collection("wikipages");
export const Invites = new Mongo.Collection("invites");