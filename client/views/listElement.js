Template.listElement.rendered = function() {
	updateOverallStatus(this.data);
}

var updateOverallStatus = function(list) {
	var el = $('div[data-list-id="' + list._id + '"]'); 
	$(el).removeClass('completed-shadow later-shadow soon-shadow urgent-shadow no-shadow');
	$(el).removeClass('completed-shadow-selected later-shadow-selected soon-shadow-selected urgent-shadow-selected no-shadow-selected');
	$(el).removeClass('completed-bkg later-bkg soon-bkg urgent-bkg no-shadow-bkg');
    switch(list.overallStatus) {
    	case 0: {
    		$(el).addClass('completed-shadow').addClass('completed-bkg'); 
    		break;
    	}
    	case 1: {
    		$(el).addClass('later-shadow').addClass('later-bkg'); 
    		break;
    	}
    	case 2: {
    		$(el).addClass('soon-shadow').addClass('soon-bkg');
    		break;
    	}
    	case 3: {
    		$(el).addClass('urgent-shadow').addClass('urgent-bkg');
    		break;
    	}
    	default: {
    		$(el).addClass('no-shadow').addClass('no-shadow-bkg');
    	}
    }
    return list.overallStatus;
}
Template.listElement.overallStatus = function() {
	return updateOverallStatus(this);
}

Template.listElement.isListOwner = function() {
	ret = (Meteor.userId() == this.owner);
	return (ret);
}

Template.listElement.sharingPeople = function() {
	return (this.stakeholderEmails.length);
}

Template.listElement.ownerEmail = function() {
	return this.stakeholderEmails[0];;
}

Template.listElement.events({
	'mouseenter .list-tile': function(e)  {
		switch(this.overallStatus) {
			case 0: $(e.currentTarget).addClass('completed-shadow completed-shadow-selected'); break;
			case 1: $(e.currentTarget).addClass('later-shadow later-shadow-selected'); break;
			case 2: $(e.currentTarget).addClass('soon-shadow soon-shadow-selected'); break;
			case 3: $(e.currentTarget).addClass('urgent-shadow urgent-shadow-selected'); break;
			default:  $(e.currentTarget).addClass('no-shadow no-shadow-selected');
		}
	},
	
	'mouseleave .list-tile': function(e) {
		switch(this.overallStatus) {
			case 0: $(e.currentTarget).removeClass('completed-shadow completed-shadow-selected'); break;
			case 1: $(e.currentTarget).removeClass('later-shadow later-shadow-selected'); break;
			case 2: $(e.currentTarget).removeClass('soon-shadow soon-shadow-selected'); break;
			case 3: $(e.currentTarget).removeClass('urgent-shadow urgent-shadow-selected'); break;
			default:  $(e.currentTarget).removeClass('no-shadow no-shadow-selected');
		}
	},
	
	'click .list-tile': function(e) {
		var selectedList = $('#list_' + this._id);
		Router.go($(selectedList).attr('data-address'));
	}

});