// Template.list.rendered = function() {
// 	console.log(Meteor.user());
// }

Template.list.cannotModifyList = function() {
	var listId = Session.get('listId');
	var list = Lists.findOne({_id: listId, owner: Meteor.userId()});
	if (list)
		return false;
	else
		return true;
}

Template.list.events({
	'click button#back-lists-btn': function(e) {
		event.preventDefault();
		Router.go($('button#back-lists-btn').attr('data-address'));
// 		Router.go($(e.target).attr('data-address'));
	},
	
	
	'click button#new-task-btn': function(e) {
// 		event.preventDefault();
		
		var currMaxRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {"rank" : -1}});
		var currMaxRank = 0;
		if (currMaxRankTask != null ) {
			currMaxRank = currMaxRankTask.rank + 1;
		}
		
		var user = Meteor.users.findOne({_id: Meteor.userId()});
		var userEmail = user.email;
		var listId = Session.get("listId");
		// var list = Lists.findOne({_id: listId, owner: user._id});
		var list = Lists.findOne({_id: listId, stakeholderEmails: userEmail});
		if (!list) {
			alert("You can't add tasks.");
			return;
		}
		
		var task = {
			name: "",
			status: 1,
			removed: false,
			owner: user._id,
			ownerEmail: user.emails[0].address.toLowerCase(),
			list: Session.get("listId"),
			assignees: [],
			stakeholders: [user._id],
			stakeholderEmails: list.stakeholderEmails,
			created_ts: (new Date()).getTime(),
			rank: currMaxRank,
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: null,
			alertdate_ts: null,
			comments: null
		}
		
		taskId = Tasks.insert(task);
		
		
		Meteor.call('updateStatus', {taskId: taskId, newStatus: 1}, function(error, ret) { 
			if (error)
				return alert(error.reason);
			// if user is not registered notify
			if (!ret)
				alert("I am sorry you can't modify the status.");
		});
				
		var maxRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {"rank" : -1}}).rank;
		var minRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {"rank" : 0}}).rank;
		Session.set('maxRankTask', maxRankTask);
		Session.set('minRankTask', minRankTask);
	},
	
	'click button#remove-list-btn': function(e) {
		event.preventDefault();
		$('button#remove-list-btn').attr('disabled', true);
		$('button#new-task-btn').attr('disabled', true);
		var res = confirm("Are you sure to remove the current list?");
		if (!res) {
			$('button#remove-list-btn').attr('disabled', false);
			$('button#new-task-btn').attr('disabled', false);
			return;
		}
			
		var curListId = this.list._id;
		var curList = Lists.findOne(curListId);
		if (!curList) {
			alert('List not found.');
			$('button#remove-list-btn').attr('disabled', false);
			$('button#new-task-btn').attr('disabled', false);
			return;
		}
		
		if (Meteor.userId() != curList.owner) {
			alert('You must be the owner to remove the current list.');
			$('button#remove-list-btn').attr('disabled', false);
			$('button#new-task-btn').attr('disabled', false);
			return;
		}		
		
		Meteor.call('removeList', curListId, function(error, ret) { 
			if (error) {
				$('button#remove-list-btn').attr('disabled', false);
				$('button#new-task-btn').attr('disabled', false);
				return alert(error.reason);
			}
			else {
				Router.go($(e.target).attr('data-address'));
			}
		});
	}
});