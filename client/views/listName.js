Template.listName.rendered =  function() {
	var mydata = this.data;
    var el = this.find('.list-name');
    switch(mydata.overallStatus) {
    	case 0: $(el).addClass('completed-bkg'); break;
    	case 1: $(el).addClass('later-bkg'); break;
    	case 2: $(el).addClass('soon-bkg'); break;
    	case 3: $(el).addClass('urgent-bkg'); break;
    	default:  $(el).addClass('no-shadow-bkg');
    }
    
    $('input[data-list-id=' + mydata._id + ']').keydown(
		function(e){
			if(e.which == 13) {
				e.preventDefault();
				$(this).blur();    
			}
		}
	); 
};

Template.listName.overallStatus = function() {
	var el = $('div[data-list-id="' + this._id + '"]');
	$(el).removeClass('completed-bkg later-bkg soon-bkg urgent-bkg no-shadow-bkg');	
	switch(this.overallStatus) {
		case 0: $(el).addClass('completed-bkg'); 
			break;
		case 1: $(el).addClass('later-bkg'); 
			break;
		case 2: $(el).addClass('soon-bkg');
			break;bkg
		case 3: $(el).addClass('urgent-bkg');
			break;
		default:  $(el).addClass('no-shadow-bkg');
	}
	return this.overallStatus;
}

Template.listName.isListOwner = function() {
	ret = (Meteor.userId() == this.owner);
	return (ret);
}

Template.listName.sharingPeople = function() {
	return (this.stakeholderEmails.length - 1);
}

Template.listName.ownerEmail = function() {
	return this.stakeholderEmails[0];;
}

Template.listName.events({
	'focus .list-name input': function(e) {
		var el = $('#list_' + this._id);
		switch(this.overallStatus) {
			case 0: $(el).addClass('completed-shadow-focus'); break;
			case 1: $(el).addClass('later-shadow-focus'); break;
			case 2: $(el).addClass('soon-shadow-focus'); break;
			case 3: $(el).addClass('urgent-shadow-focus'); break;
			default:  $(el).addClass('no-shadow-focus');
    	}
	},
	
	'mouseenter .list-name': function(e) {
		var el = $('#list_' + this._id);
		switch(this.overallStatus) {
			case 0: $(el).addClass('completed-shadow'); break;
			case 1: $(el).addClass('later-shadow'); break;
			case 2: $(el).addClass('soon-shadow'); break;
			case 3: $(el).addClass('urgent-shadow'); break;
			default:  $(el).addClass('no-shadow');
    	}
	},
	
	'mouseleave .list-name': function(e) {
		var el = $('#list_' + this._id);
		switch(this.overallStatus) {
			case 0: $(el).removeClass('completed-shadow'); break;
			case 1: $(el).removeClass('later-shadow'); break;
			case 2: $(el).removeClass('soon-shadow'); break;
			case 3: $(el).removeClass('urgent-shadow'); break;
			default:  $(el).removeClass('no-shadow');
    	}
	},
	
	'blur .list-name input': function(e) {
		var el = $('#list_' + this._id);
		switch(this.overallStatus) {
			case 0: $(el).removeClass('completed-shadow-focus'); break;
			case 1: $(el).removeClass('later-shadow-focus'); break;
			case 2: $(el).removeClass('soon-shadow-focus'); break;
			case 3: $(el).removeClass('urgent-shadow-focus'); break;
			default:  $(el).removeClass('no-shadow-focus');
    	}
		var listId = $(e.target).attr('data-list-id');
		var listNameCurr = $(e.target).val();
		var list = Lists.findOne({_id: listId});
		var ownerId = list.owner;
		var listNameOld = list.name;
		// alert(listNameCurr + ' ' + listNameOld);
		if (listNameCurr != listNameOld) {
			if (ownerId != Meteor.userId()) {
				alert("I am sorry you can't modify the list name. You need to be the owner of the list.");
				$(e.target).val(listNameOld);
			}
			else {
				Lists.update(listId, {$set: {name: listNameCurr}}, function(error) { 
					if (error) {
						alert(error.reason); 
					}
				});
			}
		}
	}
});