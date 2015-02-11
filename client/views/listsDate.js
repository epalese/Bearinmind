function getParams(startDate, endDate, listName) {
	var overallStatus = null;
	var overallStatusStyle = null;
	var numOfTasks = 0;
	var assignedTasks = 0;
	
	// compute overallStatus
	var tsk = Tasks.findOne(
				{duedate_ts: {'$gte': startDate.valueOf(), '$lte': endDate.valueOf()}},
				{sort: {"status" : -1}}
		);
	if (tsk) {
		overallStatus = tsk.status;
		switch(overallStatus) {
			case 0: overallStatusStyle = "completed-bkg"; break;
			case 1: overallStatusStyle = "later-bkg"; break;
			case 2: overallStatusStyle = "soon-bkg"; break;
			case 3: overallStatusStyle = "urgent-bkg"; break;
			default: overallStatusStyle = "no-shadow-bkg"; break;
		}
	}
	else {
		overallStatus = null;
		overallStatusStyle = "no-shadow-bkg"
	}
	
	numOfTasks = Tasks.find(
				{duedate_ts: {'$gte': startDate.valueOf(), '$lte': endDate.valueOf()}}
		).count();
	
	var user = Meteor.user();
	var userEmail = user.email;
	assignedTasks = Tasks.find(
		{ $and:
			[
				{duedate_ts: {'$gte': startDate.valueOf(), '$lte': endDate.valueOf()}},
				{assignees: userEmail}
			]
		}
		).count();
	
	return {
		startDate: startDate.format('YYYYMMDD'),
		endDate: endDate.format('YYYYMMDD'),
		overallStatus: overallStatus,
		overallStatusStyle: overallStatusStyle,
		listName: listName,
		numOfTasks: numOfTasks,
		assignedTasks: assignedTasks
	};
}

Template.listsDate.todayParams = function() {	
	var startDate = moment().startOf('day');
	var endDate = moment().endOf('day');
	
	return getParams(startDate, endDate, 'Today');
}

Template.listsDate.tomorrowParams = function() {	
	var startDate = moment().add('day',1).startOf('day');
	var endDate = moment().add('day',1).endOf('day');
						
	return getParams(startDate, endDate, 'Tomorrow');
}

Template.listsDate.thisWeekParams = function() {
	var startDate = moment().startOf('isoWeek');
	var endDate = moment().endOf('isoWeek');
						
	return getParams(startDate, endDate, 'This week');
}

Template.listsDate.nextWeekParams = function() {
	var startDate = moment().add('week', 1).startOf('isoWeek');
	var endDate = moment().add('week', 1).endOf('isoWeek');
						
	return getParams(startDate, endDate, 'Next week');
}

Template.listsDate.thisMonthParams = function() {
	var startDate = moment().startOf('month');
	var endDate = moment().endOf('month');
						
	return getParams(startDate, endDate, 'This month');
}

Template.listsDate.nextMonthParams = function() {
	var startDate = moment().add('month', 1).startOf('month');
	var endDate = moment().add('month', 1).endOf('month');
						
	return getParams(startDate, endDate, 'Next month');
}

Template.listsDate.laterParams = function() {
	var startDate = moment().add('month', 2).startOf('month');
	
	var overallStatus = null;
	var overallStatusStyle = null;
	var numOfTasks = 0;
	var assignedTasks = 0;
	
	// compute overallStatus
	var tsk = Tasks.findOne(
				{duedate_ts: {'$gte': startDate.valueOf()}},
				{sort: {"status" : -1}}
		);
		
	if (tsk) {
		overallStatus = tsk.status;
		switch(overallStatus) {
			case 0: overallStatusStyle = "completed-bkg"; break;
			case 1: overallStatusStyle = "later-bkg"; break;
			case 2: overallStatusStyle = "soon-bkg"; break;
			case 3: overallStatusStyle = "urgent-bkg"; break;
			default: overallStatusStyle = "no-shadow-bkg"; break;
		}
	}
	else {
		overallStatus = null;
		overallStatusStyle = "no-shadow-bkg"
	}
	
	numOfTasks = Tasks.find(
				{duedate_ts: {'$gte': startDate.valueOf()}}
		).count();
	
	var user = Meteor.user();
	var userEmail = user.email;
	assignedTasks = Tasks.find(
			{ $and:
				[{duedate_ts: {'$gte': startDate.valueOf()}},
				{assignees: userEmail}]
			}
		).count();
	
	return {
		startDate: startDate.format('YYYYMMDD'),
		overallStatus: overallStatus,
		overallStatusStyle: overallStatusStyle,
		listName: 'Later',
		numOfTasks: numOfTasks,
		assignedTasks: assignedTasks
	};
}

Template.listsDate.noduedateParams = function() {
	var overallStatus = null;
	var overallStatusStyle = null;
	var numOfTasks = 0;
	var assignedTasks = 0;
	
	// compute overallStatus
	var tsk = Tasks.findOne(
				{duedate_ts: null},
				{sort: {"status" : -1}}
		);
		
	if (tsk) {
		overallStatus = tsk.status;
		switch(overallStatus) {
			case 0: overallStatusStyle = "completed-bkg"; break;
			case 1: overallStatusStyle = "later-bkg"; break;
			case 2: overallStatusStyle = "soon-bkg"; break;
			case 3: overallStatusStyle = "urgent-bkg"; break;
			default: overallStatusStyle = "no-shadow-bkg"; break;
		}
	}
	else {
		overallStatus = null;
		overallStatusStyle = "no-shadow-bkg"
	}
	
	numOfTasks = Tasks.find(
				{duedate_ts: null}
		).count();
	
	var user = Meteor.user();
	var userEmail = user.email;
	assignedTasks = Tasks.find(
		{ $and:
			[
				{duedate_ts: null},
				{assignees: userEmail}
			]
		}
		).count();
	
	return {
		startDate: 'noduedate',
		overallStatus: overallStatus,
		overallStatusStyle: overallStatusStyle,
		listName: 'No due date',
		numOfTasks: numOfTasks,
		assignedTasks: assignedTasks
	};
}

Template.listsDate.events({
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
		var listName = $(e.currentTarget).attr("data-list-name")
		Session.set('dateListName', listName);
		Router.go($(e.currentTarget).attr('data-address'));
	}
});

function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length-size);
}
