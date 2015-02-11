Template.navbar.rendered = function() {
	if (!Meteor.userId()) {
		Router.go('/');
	}
};

// Template.navbar.helpers({
// 	section: function(input) {
// 		var section = Session.get('section');
// 		if (section == input)
// 			return true;
// 		else
// 			return false;
// 	}
// });

Template.navbar.cannotModifyList = function() {
	var listId = Session.get('listId');
	var list = Lists.findOne({_id: listId, owner: Meteor.userId()});
	if (list)
		return false;
	else
		return true;
}

Template.navbar.events({
});