Template.notifications.helpers({ 
	notifications: function() {
		var user = Meteor.user();
		var userEmail = user.email;
		return PopupNotifications.find({to: userEmail , fired_ts: null}); 
	},
	
	notificationCount: function(){
		var user = Meteor.user();
		var userEmail = user.email;
		var count = PopupNotifications.find({to: userEmail, fired_ts: null}).count();
		return count;
	} 
});

Template.notification.helpers({
	notificationPostPath: function() {
		return Router.routes.list.path({_id: this.listId});
	}
});
	
Template.notification.events({ 
	'click a': function() {
		var current_ts = (new Date()).getTime();
		PopupNotifications.update(this._id, {$set: {fired_ts: current_ts}});
	}
});