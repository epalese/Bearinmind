Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {email: 1}});
});

Meteor.publish('lists', function () {
	var user = Meteor.users.findOne({_id: this.userId});
	if (user) {
		var lists = Lists.find({ stakeholderEmails: user.email});
		return Lists.find({ stakeholderEmails: user.email});
	}
	else
		return null;
});

Meteor.publish('tasks', function () {
	var user = Meteor.users.findOne({_id: this.userId});
	if (user) {
		var tasks = Tasks.find({ stakeholderEmails: user.email});
  		return tasks;
  	}
  	else
  		return null;
});

Meteor.publish('popupNotifications', function () {
	var user = Meteor.users.findOne({_id: this.userId});
	if (user)
  		return PopupNotifications.find({ to: user.email});
  	else
  		return null;
});

/*
Meteor.publish('tasksStatus0', function () {
	var sub = this;
	var user = Meteor.users.findOne({_id: this.userId});
	if (user) {
		var tasksCursor = Tasks.find({stakeholderEmails: user.email, status: 0}); 
		Meteor.Collection._publishCursor(tasksCursor, sub, 'tasksStatus0');
    	sub.ready();
	}
});

Meteor.publish('tasksStatus1', function () {
	var sub = this;
	var user = Meteor.users.findOne({_id: this.userId});
	if (user) {
		var tasksCursor = Tasks.find({stakeholderEmails: user.email, status: 1}); 
		Meteor.Collection._publishCursor(tasksCursor, sub, 'tasksStatus1');
    	sub.ready();
	}
});

Meteor.publish('tasksStatus2', function () {
	var sub = this;
	var user = Meteor.users.findOne({_id: this.userId});
	if (user) {
		var tasksCursor = Tasks.find({stakeholderEmails: user.email, status: 2}); 
		Meteor.Collection._publishCursor(tasksCursor, sub, 'tasksStatus2');
    	sub.ready();
	}
});

Meteor.publish('tasksStatus3', function () {
	var sub = this;
	var user = Meteor.users.findOne({_id: this.userId});
	if (user) {
		var tasksCursor = Tasks.find({stakeholderEmails: user.email, status: 3});
		Meteor.Collection._publishCursor(tasksCursor, sub, 'tasksStatus3');
    	sub.ready();
	}
});
*/