define(['TextreeView', 'models/Contact', 'views/contact', 'text!templates/addcontact.html'],
       function(TextreeView, Contact, ContactView, addcontactTemplate)
{
  var addcontactView = TextreeView.extend({
    el: $('#content'),

    events: {
      'submit': 'search'
    },

    initialize: function(options) {
      this.router = options.router;
    },

    search: function() {
      var that = this;
      $.post('/api/contacts/find',
        this.$('form').serialize(), function(data) {
        that.render(data);
      }).error(function(){
        $('#results').text('No contacts found.');
        $('#results').slideDown();
      });
      return false;
    },

    render: function(resultList) {
      var that = this;

      this.$el.html(addcontactTemplate);
      if (null !== resultList) {
        _.each(resultList, function (contactJson) {
          var addButton = true;

          if (contactJson._id == that.router.loggedAccount._id) { // skip current account
            return;
          }
          
          for (var i = 0; i < that.router.loggedAccount.contacts.length; i++) {
            if (contactJson._id == that.router.loggedAccount.contacts[i].accountId) {
              addButton = false;
            }
          }

          var contactModel = new Contact(contactJson);
          var contactHtml = (new ContactView({ addButton: addButton, model: contactModel })).render().el;
          $('#results_table').append(contactHtml);
        });
      }
    }

  });

  return addcontactView;
});