// Template.listsStatus.rendered = function() {
// 	console.log(Meteor.user());
// }

Template.listsStatus.events({
	'mouseenter .list-tile': function(e)  {
		var overallStatus = parseInt($(e.currentTarget).attr("data-overall-status"));

		switch(overallStatus) {
			case 0: $(e.currentTarget).addClass('completed-shadow completed-shadow-selected'); break;
			case 1: $(e.currentTarget).addClass('later-shadow later-shadow-selected'); break;
			case 2: $(e.currentTarget).addClass('soon-shadow soon-shadow-selected'); break;
			case 3: $(e.currentTarget).addClass('urgent-shadow urgent-shadow-selected'); break;
			default:  $(e.currentTarget).addClass('no-shadow no-shadow-selected');
		}
	},
	
	'mouseleave .list-tile': function(e) {
		var overallStatus = parseInt($(e.currentTarget).attr("data-overall-status"));
		switch(overallStatus) {
			case 0: $(e.currentTarget).removeClass('completed-shadow completed-shadow-selected'); break;
			case 1: $(e.currentTarget).removeClass('later-shadow later-shadow-selected'); break;
			case 2: $(e.currentTarget).removeClass('soon-shadow soon-shadow-selected'); break;
			case 3: $(e.currentTarget).removeClass('urgent-shadow urgent-shadow-selected'); break;
			default:  $(e.currentTarget).removeClass('no-shadow no-shadow-selected');
		}
	},
	
	'click .list-tile': function(e) {
		Router.go($(e.currentTarget).attr('data-address'));
	}
});

Template.listsStatus.status0 = function() {
	return Tasks.find({status: 0}).count();
};

Template.listsStatus.status0Assigned = function() {
	var user = Meteor.user();
	var userEmail = user.email;
	assignedTasks = Tasks.find(
		{ $and:
			[
				{status: 0},
				{assignees: userEmail}
			]
		}).count();
	return assignedTasks;
};

Template.listsStatus.status1 = function() {
	return Tasks.find({status: 1}).count();
};

Template.listsStatus.status1Assigned = function() {
	var user = Meteor.user();
	var userEmail = user.email;
	assignedTasks = Tasks.find(
		{ $and:
			[
				{status: 1},
				{assignees: userEmail}
			]
		}).count();
	return assignedTasks;
};

Template.listsStatus.status2 = function() {
	return Tasks.find({status: 2}).count();
};

Template.listsStatus.status2Assigned = function() {
	var user = Meteor.user();
	var userEmail = user.email;
	assignedTasks = Tasks.find(
		{ $and:
			[
				{status: 2},
				{assignees: userEmail}
			]
		}).count();
	return assignedTasks;
};


Template.listsStatus.status3 = function() {
	return Tasks.find({status: 3}).count();
};

Template.listsStatus.status3Assigned = function() {
	var user = Meteor.user();
	var userEmail = user.email;
	var assignedTasks = Tasks.find(
		{ $and:
			[
				{status: 3},
				{assignees: userEmail}
			]
		}).count();
	return assignedTasks;
};

