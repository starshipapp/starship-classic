import { Meteor } from 'meteor/meteor';
import Planets from '../imports/api/planets';
import Pages from '../imports/api/components/pages';

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  import '../imports/api/users';
});
