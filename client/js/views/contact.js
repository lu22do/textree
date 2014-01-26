define(['TextreeView', 'text!templates/contact.html'], function(TextreeView, contactTemplate) {
  var contactView = TextreeView.extend({
    addButton: false,
    removeButton: false,

    tagName: 'tr',

    events: {
      'click #addbutton': 'addContact',
      'click #removebutton': 'removeContact'
    },

    addContact: function() {
      var $responseArea = this.$('#actionarea');
      $responseArea.text('Adding contact...');

      $.ajax({
        url: '/api/accounts/me/contact',
        type: 'POST',
        data: {contactId: this.model.get('_id')}
      })
      .done(function onSuccess() {
        $responseArea.text('Contact Added');
      })
      .fail(function onError() {
        $responseArea.text('Could not add contact');
      });
    },

    removeContact: function() {
      var $responseArea = this.$('#actionarea');
      $responseArea.text('Removing contact...');

      $.ajax({
        url: '/api/accounts/me/contact',
        type: 'DELETE',
        data: {contactId: this.model.get('accountId')} 
      })
      .done(function onSuccess() {
        $responseArea.text('Contact Removed');
      })
      .fail(function onError() {
        $responseArea.text('Could not remove contact');
      });
    },

    initialize: function(options) {
      if (options.addButton) {
        this.addButton = options.addButton;
      }

      if (options.removeButton) {
        this.removeButton = options.removeButton;
      }
    },

    render: function() {
      $(this.el).html(_.template(contactTemplate, {
        model: this.model.toJSON(),
        addButton: this.addButton,
        removeButton: this.removeButton
      }));
      return this;
    }
  });

  return contactView;
});