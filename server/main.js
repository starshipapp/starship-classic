import { Meteor } from 'meteor/meteor';
import '../imports/api/planets';
import '../imports/api/components/pages';
import '../imports/api/components/wiki/wiki';
import '../imports/api/components/wiki/wikipage';
import '../imports/api/invites';
import '../imports/api/components/files/files';

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  import '../imports/api/users';
});
