define(['TextreeView', 'text!templates/activity.html'], function(TextreeView, activityTemplate) {
  var activityView = TextreeView.extend({
    tagName: 'li',

    render: function() {
      var act = this.model;
      var date = new Date(act.get('date'));
      var curdate = new Date();
      var displaydate = date.toLocaleDateString();
      if (displaydate == curdate.toLocaleDateString())
        displaydate = 'Today';

      var text = displaydate + ', ' + date.toLocaleTimeString() + ': ';
      var name = act.get('relName');
      var id = act.get('relId');
      var name2 = act.get('relName2');
      var id2 = act.get('relId2');

      switch(act.get('type')) {
        case 'BranchCreated':
        case 'BranchUpdated':
        case 'BranchDeleted':
          if (!name) {
            name = 'Root';
          }  
          break;
      }

      switch(act.get('type')) {
        case 'TreeCreated':
          text += '"<a href="#tree/' + id + '">' + name + '</a>" tree created';
          break;
        case 'TreeDeleted':
          text += '"' + name + '" tree deleted';
          break;
        case 'BranchCreated':
          text += '"<a href="#branch/' + id + '">' + name + '</a>" branch of "<a href="#treedetails/' + 
            id2 + '">' + name2 + '</a>" tree created';
          break;
        case 'BranchUpdated':
          text += '"<a href="#branch/' + id + '">' + name + '</a>" branch of "<a href="#treedetails/' + 
            id2 + '">' + name2 + '</a>" tree updated';
          break;
        case 'BranchDeleted':
          text += '"' + name + '" branch of "<a href="#treedetails/' + 
            id2 + '">' + name2 + '</a>" tree deleted';
          break;
      }
      $(this.el).html(_.template(activityTemplate, {activity: text}));
      return this;
    }
  });

  return activityView;
});
