define(['TextreeView', 'views/index', 'views/register', 'views/login', 'views/forgotpassword', 'views/profile', 
  'views/contacts', 'views/addcontact', 'views/createtree', 'views/treelist', 'views/topbar', 'views/branch', 'views/tree',
  'models/Account', 'models/ActivityCollection', 'models/ContactCollection', 'models/Tree', 'models/TreeCollection', 'models/Branch'],
  function(TextreeView, IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView, ContactsView, AddContactView, 
    CreateTreeView, TreeListView, TopbarView, BranchView, TreeView,
    Account, ActivityCollection, ContactCollection, Tree, TreeCollection, Branch) {
  var topbarView = new TopbarView();

  var Router = Backbone.Router.extend({
    currentView: null,
    loggedAccount: null,

    socketEvents: _.extend({}, Backbone.Events),

    routes: {
      'login(/:email)': 'login',
      'register': 'register',
      'forgotpassword': 'forgotpassword',
      'logout': 'logout',

      // with topbar links (extend TextreeView):
      'index': 'index',
      'createtree': 'createtree',
      'addcontact': 'addcontact',
      'treelist/:id': 'treelist',
      'treelist/:id/:authorpseudo': 'treelist',
      'profile/:id': 'profile',
      'contacts/:id': 'contacts',
      'tree/:id': 'tree',
      'branch/:id': 'branch'
    },

    changeView: function(view, TopbarLink) {
      if (null !== this.currentView) {
        this.currentView.undelegateEvents();
      }
      
      topbarView.render(TopbarLink);

      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
      var activityCollection = new ActivityCollection();
      activityCollection.url = '/api/accounts/me/activities?count=10';

      var myTreeCollection = new TreeCollection();
      myTreeCollection.url = '/api/accounts/me/trees?count=3&filter=lastUpdated';

      var otherTreeCollection = new TreeCollection();
      otherTreeCollection.url = '/api/trees?count=5&filter=lastUpdated&exclude=me';

      this.changeView(new IndexView({
        activityCollection: activityCollection,
        myTreeCollection: myTreeCollection,
        otherTreeCollection: otherTreeCollection,
        socketEvents: this.socketEvents
      }), 'index');
      
      activityCollection.fetch();
      myTreeCollection.fetch({reset: true});
      otherTreeCollection.fetch({reset: true});
    },

    treelist: function(id, authorpseudo) {
      var treeCollection = new TreeCollection();
      treeCollection.url = '/api/accounts/' + id + '/trees';
      this.changeView(new TreeListView({
        el: $('#content'),
        collection: treeCollection,
        complete: true,
        withAuthor: false,
        ownertitle: authorpseudo
      }), id == 'me' ? 'mytrees' : 'mycontacts');
      treeCollection.fetch({reset: true});
    },

    createtree: function() {
      this.changeView(new CreateTreeView(), 'createtree');
    },

    addcontact: function() {
      this.changeView(new AddContactView({router: this}), 'addcontact');
    },

    login: function(email) {
      this.changeView(new LoginView({router: this, email: email}), '');
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView(), '');
    },

    logout: function() {
      $.post('/api/logout', {});
      this.loggedAccount = null;
      window.location.hash = 'login';
    },
    
    register: function() {
      this.changeView(new RegisterView(), '');
    },

    profile: function(id) {
      var model = new Account({id: id});
      this.changeView(new ProfileView({
        model: model,
        socketEvents: this.socketEvents,
        router: this
      }), id == 'me' ? 'myprofile' : 'mycontacts');
      model.fetch();
    },

    contacts: function(id) {
      var contactId = id ? id : 'me';
      var contactsCollection = new ContactCollection();
      contactsCollection.url = '/api/accounts/' + contactId + '/contacts';
      this.changeView(new ContactsView({
        collection: contactsCollection
      }), 'mycontacts');
      contactsCollection.fetch({reset: true});
    },

    tree: function(id) {
      var model = new Tree({id: id});
      this.changeView(new TreeView({
        model: model
      }), 'tree');
      model.fetch();
    },

    branch: function(id) {
      var model = new Branch({id: id});
      model.url = '/api/branches/' + id;
      this.changeView(new BranchView({
        model: model,
        router: this
      }), 'branch');
      model.fetch();
    },

    setLoggedAccount: function(la) {
      this.loggedAccount = la;
      topbarView.setLoggedUser(la.pseudo);
    }
  });

  return new Router();
});