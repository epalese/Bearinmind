Lists = new Meteor.Collection("lists");
Tasks = new Meteor.Collection("tasks");
PopupNotifications = new Meteor.Collection("popupNotifications");
EmailNotificationsQueue = new Meteor.Collection("emailNotificationsQueue");
PopupNotificationsQueue = new Meteor.Collection("popupNotificationsQueue");
DueDateQueue = new Meteor.Collection("dueDateQueue");

Lists.allow({
	insert: function(userId, doc) {
    	// only allow posting if you are logged in
		return !! userId; 
	},
	update: function(userId, doc) {
    	if (userId == doc.owner)
    		return true;
    	return false;
	}
});

Tasks.allow({
	insert: function(userId, doc) {
		// var list = Lists.findOne({_id: doc.list, owner: userId});
		var user = Meteor.users.findOne({_id: Meteor.userId()});
		var userEmail = user.email;
		var list = Lists.findOne({_id: doc.list, stakeholderEmails: userEmail});
		if (list)
		return !! list; 
	},
	
	update: function(userId, doc, fields, modifier) {
		var user = Meteor.users.findOne({_id: Meteor.userId()});
		if (!user) return false;
		
		var userEmail = user.email;
		var list = Lists.findOne({_id: doc.list, stakeholderEmails: userEmail});
		if (!list) return false;
		
		var assignee = (doc.assignees[0] == userEmail);
		if (
			(fields[0] == 'alertdate_ts' || fields[0] == 'value_before' || fields[0] ==  'time_unit_before')
				&& modifier['$set'] && assignee) {
			return true;	
		}
		
		if (fields[0] == 'comments' && modifier['$set'] && modifier["$set"].comments != null) {
			return true;	
		}
		
		if (userId == doc.owner || userId == list.owner) 
			return true;
		else 
			return false;
	},
		
	remove: function(userId, doc) {
		var list = Lists.findOne({_id: doc.list, owner: userId});
    	if ((userId == doc.owner) || (userId == list.owner)) 
    		return true;
    	return false;
	}
});

PopupNotifications.allow({
	update: function(userId, ntf) {
		var user = Meteor.user();
		var userEmail = user.email;
    	if (userEmail == ntf.to)
    		return true;
    	return false;
	}
});