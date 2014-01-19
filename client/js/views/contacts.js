define(['TextreeView', 'views/contact', 'text!templates/contacts.html'], 
function(TextreeView, ContactView, contactsTemplate) {
  var contactsView = TextreeView.extend({
    el: $('#content'),

    initialize: function() {
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      this.$el.html(contactsTemplate);
    },

    renderCollection: function(collection) {
      collection.each(function(contact) {
        var pseudo = contact.get('pseudo');
        if (pseudo) {
          var statusHtml = (new ContactView({removeButton: true, model: contact})).render().el;
          $(statusHtml).appendTo('.contacts_list');
        }
      });
    }
  });

  return contactsView;
});