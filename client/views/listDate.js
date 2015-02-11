function getOverallStatus(startDate, endDate) {
	var overallStatus = null;
	
	if (startDate == 'noduedate') {
		var tsk = null;
		tsk = Tasks.findOne(
				{duedate_ts: null},
				{sort: {"status" : -1}}
		);
		if (tsk) {
			overallStatus = tsk.status;
		}
		return overallStatus;
	}
	
	if (endDate) {
		var tsk = null;
		tsk = Tasks.findOne(
				{duedate_ts: {'$gte': startDate, '$lte': endDate}},
				{sort: {"status" : -1}}
		);
		if (tsk) {
			overallStatus = tsk.status;
		}
		return overallStatus;
	}
	else {
		var tsk = null;
		tsk = Tasks.findOne(
				{duedate_ts: {'$gte': startDate}},
				{sort: {"status" : -1}}
		);
		if (tsk) {
			overallStatus = tsk.status;
		}
		return overallStatus;
	}
}

Template.listDate.overallStatusStyle = function () {
	var overallStatus = getOverallStatus(this.startDate, this.endDate);
	if (overallStatus == 0)
		return "completed-bkg";
	if (overallStatus == 1)
		return "later-bkg";
	if (overallStatus == 2)
		return "soon-bkg";
	if (overallStatus == 3)
		return "urgent-bkg";
	if (overallStatus == null)
		return "no-shadow-bkg";
}

Template.listDate.overallStatus = function() {
	return getOverallStatus(this.startDate, this.endDate);
};

Template.listDate.tasks = function() {
	return this.tasks;
}

Template.listDate.name = function() {
	return Session.get('dateListName');	
};

Template.listDate.events({ 
	'click button#back-lists-btn': function(e) {
		event.preventDefault(); 
		Router.go($('button#back-lists-btn').attr('data-address'));
	}
});