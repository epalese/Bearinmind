Template.lists.helpers({
	lists: function() {
		return Lists.find();
	}
});

Template.lists.events({
	'click #new-list-btn': function(event) {
		event.preventDefault();
 		var user = Meteor.users.findOne({_id: Meteor.userId()});
		var list = {
 			name: "",
 			owner: user._id,
 			overallStatus: 0,
 			assignees: [],
 			stakeholders: [user._id],
 			stakeholderEmails: [user.email],
 			removed: false,
 			ts: (new Date()).getTime(),
 		};
 
 		listId = Lists.insert(list);
 		Router.go('list', {_id: listId}); 
	}
});

// Template.lists.rendered = function() {
// 	console.log(Meteor.user());
// }