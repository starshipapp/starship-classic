import { Meteor } from 'meteor/meteor';
import '../imports/api/planets';
import '../imports/api/components/pages';
import '../imports/api/components/wiki/wiki';
import '../imports/api/components/wiki/wikipage';
import '../imports/api/invites';
import '../imports/api/components/files/files';
import '../imports/api/components/files/fileobjects';
import '../imports/api/components/forum/forum';
import '../imports/api/components/forum/forumpost';
import '../imports/api/components/forum/forumreply';
import '../imports/api/reports';

Meteor.startup(() => {
  import '../imports/api/users';
  import './aws';
});
