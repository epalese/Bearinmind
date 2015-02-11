Template.listOptions.rendered = function() {
	var listid = this.data._id;
	
	$('input[name="sharing-email"]').keydown(
		function(e){
			if(e.which == 13) {
				e.preventDefault();
				$('#sharing-btn').click();
// 				$(this).blur(); 
			}
		}
	);
	// Define a dependency between a change in the list and the stakeholderEmail
	Deps.autorun(function(){
		if (Meteor.userId()) {
			var list = Lists.findOne(listid);
			// set Session variable in method callback
			Meteor.call('stakeholderEmails', listid, function(error, stakeholderEmails) { 
			if (error)
				return alert(error.reason);
			Session.set('stakeholderEmails', stakeholderEmails);
			});
		}
	});
}

Template.listOptions.persons = function() {
	return Session.get('stakeholderEmails');
}

// Template.sharingList.helpers({
// 	persons: function() {
// 		return Session.get('stakeholderEmails');
// 	}
// });

Template.listOptions.stekeholderEmails = function() {
	var stakeholderEmails = Lists.findOne(this._id).stakeholderEmails;
	
	if (Meteor.userId()) {
		Meteor.call('stakeholderEmails', this.data._id, function(error, stakeholderEmails) { 
			if (error)
				return alert(error.reason);
			else {
				Session.set('stakeholderEmails', stakeholderEmails);
			}
		});
	}
	
}

Template.listOptions.sharingPeople = function() {
	return (this.stakeholderEmails.length);
};

Template.listOptions.cannotModify = function() {
	var list = Lists.findOne({_id: this._id, owner: Meteor.userId()});
	if (list) {
		return false;
	}
	else
		return true;
};

Template.listOptions.events({
	'click #sharing-button': function(e, template) {
		$('#list-properties').removeClass('in');
	},
	
	'click #properties-button': function(e, template) {
		$('#sharing-people').removeClass('in');
	},
	
	'click #sharing-btn': function(e, template) {
		e.preventDefault();
		var userEmail = $('.new-friend-email').val().toLowerCase().trim();
		
		if (!userEmail) {
			alert("You should add an email address.");
			return;
		}
		
		var stakeholderEmailsObj = Session.get('stakeholderEmails');
		if (!stakeholderEmailsObj)
			return;
			
		var stakeholderEmails = [];
		for (var i = 0; i < stakeholderEmailsObj.length; i++) {
			stakeholderEmails.push(stakeholderEmailsObj[i].email);
		}
		
		if ( $.inArray( userEmail, stakeholderEmails ) == -1) {
			Meteor.call('shareList', {listId: this._id, email: userEmail}, function(error, ret) { 
				if (error)
					return alert(error.reason);
				// if user is not registered notify
				if (!ret)
					alert("The user is not registered. We are sending an email to notify your sharing.");
			});
		}
		else {
			alert("List already shared with " + userEmail);
		}
		
		$('.new-friend-email').val('');
	},
	
	'click .sharing-list .glyphicon-remove': function(e, template) {
		e.preventDefault();
		var userEmail = $(e.currentTarget).siblings('.user-email').text();
		var listId = $(e.currentTarget).parents('.sharing-list').attr('data-parent-list-id');
		
		if (!userEmail) {
			alert(userEmail + " doesn't appear in the sharing list.");
			return;
		}
		
		var stakeholderEmailsObj = Session.get('stakeholderEmails');
		var stakeholderEmails = [];
		for (var i = 0; i < stakeholderEmailsObj.length; i++) {
			stakeholderEmails.push(stakeholderEmailsObj[i].email);
		}
		
		if ( $.inArray( userEmail, stakeholderEmails ) != -1) {		
			Meteor.call('unshareList', {listId: listId, email: userEmail}, function(error, ret) { 
				if (error)
					return alert(error.reason);
				// if user is not registered notify
				// if (!ret)
				// alert("The user is not registered. We are sending an email to notify your sharing.");
			});
			// Router.go('/lists');
		}
		else {
			alert(userEmail + " doesn't appear in the sharing list.");
		}
	}
});