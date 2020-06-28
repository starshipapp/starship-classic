import { Meteor } from 'meteor/meteor';
import Planets from '../imports/api/planets';
import Pages from '../imports/api/components/pages';
import Wikis from '../imports/api/components/wiki/wiki';
import WikiPages from '../imports/api/components/wiki/wikipage';

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  import '../imports/api/users';
});
