define(['TextreeView', 'models/Contact', 'views/Contact', 'text!templates/addcontact.html'],
       function(TextreeView, Contact, ContactView, addcontactTemplate)
{
  var addcontactView = TextreeView.extend({
    el: $('#content'),

    events: {
      "submit form": "search"
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
        $("#results").text('No contacts found.');
        $("#results").slideDown();
      });
      return false;
    },

    render: function(resultList) {
      var that = this;

      this.$el.html(addcontactTemplate);
      if ( null != resultList ) {
        _.each(resultList, function (contactJson) {
          if (contactJson._id == that.router.loggedAccount._id) { // skip current account
            return;
          }
          var contactModel = new Contact(contactJson);
          var contactHtml = (new ContactView({ addButton: true, model: contactModel })).render().el;
          $('#results').append(contactHtml);
        });
      }
    }

  });

  return addcontactView;
});