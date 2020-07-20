import { Meteor } from 'meteor/meteor';
import '../imports/api/planets';
import '../imports/api/components/pages';
import '../imports/api/components/wiki/wiki';
import '../imports/api/components/wiki/wikipage';
import '../imports/api/invites';
import '../imports/api/components/files/files';
import '../imports/api/components/files/fileobjects';

Meteor.startup(() => {
  import '../imports/api/users';
});
