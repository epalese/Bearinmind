Template.listStatus.overallStatusStyle = function () {
// 	switch(this.overallStatus) {
// 		case 0: return "completed-bkg"; break;
// 		case 1: return "later-bkg"; break;
// 		case 2: return "soon-bkg"; break;
// 		case 3: return "urgent-bkg"; break;
// 		default: return ""; break;
// 	}
	if (this.overallStatus == 0)
		return "completed-bkg";
	else if (this.overallStatus == 1)
		return "later-bkg";
	else if (this.overallStatus == 2)
		return "soon-bkg";
	if (this.overallStatus == 3)
		return "urgent-bkg";	
}

Template.listStatus.overallStatus = function() {
    return this.overallStatus;
};

Template.listStatus.tasks = function() {
	return this.tasks;
}

Template.listStatus.name = function() {
	var status = parseInt(this.overallStatus);
	switch(status) {
		case 0: return "Completed"; break;
		case 1: return "Later"; break;
		case 2: return "Soon"; break;
		case 3: return "Urgent"; break;
		default: return ""; break;
	}	
};

Template.listStatus.events({ 
	'click button#back-lists-btn': function(e) {
		event.preventDefault(); 
		Router.go($('button#back-lists-btn').attr('data-address'));
	}
});