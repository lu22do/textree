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
        'login': 'login',
        'register': 'register',
        'forgotpassword': 'forgotpassword',
        'logout': 'logout',

        // with topbar links (extend TextreeView):
        'index': 'index',
        'treelist': 'treelist',
        'createtree': 'createtree',
        'addcontact': 'addcontact',
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
        activityCollection.url = '/api/accounts/me/activities';

        var treeCollection = new TreeCollection();
        treeCollection.url = '/api/accounts/me/trees';

        this.changeView(new IndexView({
          activityCollection: activityCollection,
          treeCollection: treeCollection,
          socketEvents: this.socketEvents
        }), 'index');
        
        activityCollection.fetch();
        treeCollection.fetch({reset: true});
      },

      treelist: function() {
        var treeCollection = new TreeCollection();
        treeCollection.url = '/api/accounts/me/trees';
        this.changeView(new TreeListView({
          el: $('#content'),
          collection: treeCollection
        }), 'treelist');
        treeCollection.fetch({reset: true});
      },

      createtree: function() {
        this.changeView(new CreateTreeView(), 'createtree');
      },

      addcontact: function() {
        this.changeView(new AddContactView({router: this}), 'addcontact');
      },

      login: function() {
        this.changeView(new LoginView({router: this}), '');
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
          socketEvents: this.socketEvents
        }), 'myprofile');
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
        this.changeView(new BranchView({
          model: model
        }), 'branch');
        model.fetch();
      },
    });

    return new Router();
  });