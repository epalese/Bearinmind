Template.task.rendered =  function() {	
	$('#task_' + this.data._id + ' .task-move-container').hide();
	$('#task_' + this.data._id + ' .task-remove-container').hide();
	updateStatus(this.data);
	updateAssignee(this.data);
	updateDueDateAndAlert(this.data);
	updateComments(this.data);
	
	var task = this.data;
		
	// LISTENERS
	$('textarea[data-task-id=' + this.data._id + ']').keydown(
		function(e){
			if(e.which == 13) {
				e.preventDefault();
				$(this).blur();    
			}
		}
	);
	$('#taskcontent_' + this.data._id + ' .value-before').keydown(
		function(e){
			if(e.which == 13) {
				e.preventDefault();
				$(this).blur();
			}
		}
	);
	$('#taskcontent_' + this.data._id + ' input.datepicker').change(function(e) {
		if (this.lastDateSelected != $(this).val()) {
			this.lastDateSelected = $(this).val();
			var dateStringParts = this.lastDateSelected.split('/');
			$(this).removeClass('input-error');
		}
	}); // end $().change()
};

Template.task.removed = function() {
	return this.removed;
};

var updateStatus = function(task) {
	// set status
	var el = $('div[data-task-id="' + task._id + '"]');
	// console.log('[updateStatus] task name = ' + task.name + ' status =' +task.status + ' removed = ' + task.removed);
	$(el).removeClass('completed-shadow later-shadow soon-shadow urgent-shadow no-shadow');
	$(el).removeClass('completed-bkg later-bkg soon-bkg urgent-bkg no-shadow-bkg');
	$(el).find('.btn-status-completed').removeClass('active');
	$(el).find('.btn-status-later').removeClass('active');
	$(el).find('.btn-status-soon').removeClass('active');
	$(el).find('.btn-status-urgent').removeClass('active');
	
	if (!task.removed) {
		switch(task.status) {
			case 0: $(el).addClass('completed-shadow'); 
					$(el).addClass('completed-bkg'); 
					$(el).find('.btn-status-completed').addClass('active');
					$(el).find('.btn-status-later').removeClass('active');
					$(el).find('.btn-status-soon').removeClass('active');
					$(el).find('.btn-status-urgent').removeClass('active');
				break;
			case 1: $(el).addClass('later-shadow'); 
					$(el).addClass('later-bkg');
					$(el).find('.btn-status-later').addClass('active');
					$(el).find('.btn-status-completed').removeClass('active');
					$(el).find('.btn-status-soon').removeClass('active');
					$(el).find('.btn-status-urgent').removeClass('active');
				break;
			case 2: $(el).addClass('soon-shadow');
					$(el).addClass('soon-bkg');
					$(el).find('.btn-status-soon').addClass('active');
					$(el).find('.btn-status-completed').removeClass('active');
					$(el).find('.btn-status-later').removeClass('active');
					$(el).find('.btn-status-urgent').removeClass('active');
				break;
			case 3: $(el).addClass('urgent-shadow');
					$(el).addClass('urgent-bkg');
					$(el).find('.btn-status-urgent').addClass('active');
					$(el).find('.btn-status-completed').removeClass('active');
					$(el).find('.btn-status-later').removeClass('active');
					$(el).find('.btn-status-soon').removeClass('active');
				break;
			default:  $(el).addClass('no-shadow');
		}
	}
	else {
		$(el).addClass('no-shadow'); 
		$(el).addClass('no-shadow-bkg'); 
		switch(task.status) {
			case 0: $(el).find('.btn-status-completed').addClass('active');
				break;
			case 1: $(el).find('.btn-status-later').addClass('active');
				break;
			case 2: $(el).find('.btn-status-soon').addClass('active');
				break;
			case 3: $(el).find('.btn-status-urgent').addClass('active');
				break;
			default:  $(el).addClass('no-shadow');
		}
	}
	return task.status;
}
Template.task.status = function() {
	return updateStatus(this);	
}
/* Used to change the background when the task is removed/restored */
Template.task.isRemoved = function() {
	updateStatus(this);
	return this.removed;
};

var updateDueDateAndAlert = function(task) {
	// as a first step enable everything: since there is no more reload and the approach
	// later is to disable what must not be used.
	$('#taskcontent_' + task._id + ' input.datepicker').attr('disabled',false);
	$('#taskcontent_' + task._id + ' select.hour-selector').attr('disabled',false);
	$('#taskcontent_' + task._id + ' select.minutes-selector').attr('disabled',false);
	$('#taskcontent_' + task._id + ' .repeat-time-value').attr('disabled',false);
	$('#taskcontent_' + task._id + ' .repeat-time-unit').attr('disabled',false);
	$('#taskcontent_' + task._id + ' .alert-email').attr('disabled',false);
	$('#taskcontent_' + task._id + ' .alert-notification').attr('disabled',false);
	$('#taskcontent_' + task._id + ' .value-before').attr('disabled',false);
	$('#taskcontent_' + task._id + ' .time-unit-before').attr('disabled',false);
	$('#taskcontent_' + task._id + ' #due-date-set.btn-set').prop('disabled', false);
	$('#taskcontent_' + task._id + ' #due-date-unset.btn-set').prop('disabled', false);
	$('#taskcontent_' + task._id + ' #alert-set.btn-set').prop('disabled', false);
	$('#taskcontent_' + task._id + ' #alert-unset.btn-set').prop('disabled', false);

	if ((task.duedate_ts != null) && (task.duedate_ts != '')) {
		var duedate = new Date(task.duedate_ts);
		this.lastDateSelected = pad(duedate.getDate(), 2) + "/" 
									+ pad((duedate.getMonth() + 1),2)
									+ "/" + (duedate.getYear()+1900);
		// set up due date values
		$('#taskcontent_' + task._id + ' input.datepicker').val(this.lastDateSelected);
		$('#taskcontent_' + task._id + ' select.hour-selector').val(duedate.getHours());
		$('#taskcontent_' + task._id + ' select.minutes-selector').val(duedate.getMinutes());
		$('#taskcontent_' + task._id + ' .repeat-time-value').val(task.repeat_time_value);
		$('#taskcontent_' + task._id + ' .repeat-time-unit').val(task.repeat_time_unit);
		// disable due date inputs
		$('#taskcontent_' + task._id + ' input.datepicker').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' select.hour-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' select.minutes-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .repeat-time-value').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .repeat-time-unit').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' #due-date-set.btn-set').prop('disabled', true);
		$('#taskcontent_' + task._id + ' #due-date-unset.btn-set').prop('disabled', false);
		
		if (task.alertdate_ts != null) {
			$('#taskcontent_' + task._id + ' .alert-email').prop('checked', task.email);
			$('#taskcontent_' + task._id + ' .alert-notification').prop('checked', task.notification);
			$('#taskcontent_' + task._id + ' .value-before').val(task.value_before);
			$('#taskcontent_' + task._id + ' .time-unit-before').val(task.time_unit_before);
			$('#taskcontent_' + task._id + ' .alert-email').attr('disabled','disabled');
			$('#taskcontent_' + task._id + ' .alert-notification').attr('disabled','disabled');
			$('#taskcontent_' + task._id + ' .value-before').attr('disabled','disabled');
			$('#taskcontent_' + task._id + ' .time-unit-before').attr('disabled','disabled');
			$('#taskcontent_' + task._id + ' #alert-set.btn-set').prop('disabled', true);
			$('#taskcontent_' + task._id + ' #alert-unset.btn-set').prop('disabled', false);
		}
		else {
			// if alarm is not set enable only check boxes and then after clicking on 
			// them enable the remaining compontents
			$('#taskcontent_' + task._id + ' .alert-email').prop('disabled', false);
			$('#taskcontent_' + task._id + ' .alert-notification').prop('disabled', false);
			
			var email = $('#taskcontent_' + task._id + ' .alert-email').prop('checked');
			var notification = $('#taskcontent_' + task._id + ' .alert-notification').prop('checked');
			
			if (email || notification) {
				$('#taskcontent_' + task._id + ' .value-before').prop('disabled', false);
				$('#taskcontent_' + task._id + ' .time-unit-before').prop('disabled', false);
				$('#taskcontent_' + task._id + ' #alert-set.btn-set').prop('disabled', false);
				$('#taskcontent_' + task._id + ' #alert-unset.btn-set').prop('disabled', true);
			}
			else {
				$('#taskcontent_' + task._id + ' .value-before').prop('disabled', true);
				$('#taskcontent_' + task._id + ' .time-unit-before').prop('disabled', true);
				$('#taskcontent_' + task._id + ' #alert-set.btn-set').prop('disabled', true);
				$('#taskcontent_' + task._id + ' #alert-unset.btn-set').prop('disabled', true);
			}
		}
		
	}
	else {
		$('#taskcontent_' + task._id + ' select.hour-selector').prop('disabled',false);
		$('#taskcontent_' + task._id + ' select.minutes-selector').prop('disabled',false);
		$('#taskcontent_' + task._id + ' .repeat-time-value').prop('disabled',false);
		$('#taskcontent_' + task._id + ' .repeat-time-unit').prop('disabled',false);
		$('#taskcontent_' + task._id + ' #due-date-set.btn-set').prop('disabled', false);
		$('#taskcontent_' + task._id + ' #due-date-unset.btn-set').prop('disabled', true);
		
		// disabling all alert options since we don't have a due date yet
		$('#taskcontent_' + task._id + ' .alert-email').prop('disabled',true);;
		$('#taskcontent_' + task._id + ' .alert-notification').prop('disabled',true);
		$('#taskcontent_' + task._id + ' .alert-notification').prop('disabled',true);
		$('#taskcontent_' + task._id + ' .value-before').prop('disabled',true);
		$('#taskcontent_' + task._id + ' .time-unit-before').prop('disabled',true);
		$('#taskcontent_' + task._id + ' #alert-set.btn-set').prop('disabled',true);
		$('#taskcontent_' + task._id + ' #alert-unset.btn-set').prop('disabled',true);		
	}

	var user = Meteor.user();
	var userEmail = user.email;
	var listOwner = Lists.findOne({_id: task.list, owner: user._id}) != null ? true : false;
	var taskOwner = task.owner == user._id? true : false;
	var taskAssignee = task.assignees[0] == userEmail? true : false;
	
	if (!listOwner && !taskOwner && !taskAssignee) {
		$('#taskcontent_' + task._id + ' .assignee-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .btn-status').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' input.datepicker').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .repeat-time-value').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .repeat-time-unit').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' select.hour-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' select.minutes-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .alert-email').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .alert-notification').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .alert-notification').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .value-before').val(null);
		$('#taskcontent_' + task._id + ' .time-unit-before').val(null);
		$('#taskcontent_' + task._id + ' .value-before').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .time-unit-before').attr('disabled','disabled');
		
		$('#taskcontent_' + task._id + ' #due-date-set.btn-set').prop('disabled', true);
		$('#taskcontent_' + task._id + ' #due-date-unset.btn-unset').prop('disabled', true);
		$('#taskcontent_' + task._id + ' #alert-set.btn-set').prop('disabled', true);
		$('#taskcontent_' + task._id + ' #alert-unset.btn-unset').prop('disabled', true);		

		$('#taskcontent_' + task._id + ' .btn-set').prop('disabled', true);
		$('#taskcontent_' + task._id + ' .btn-unset').prop('disabled', true);
	}
	if (!listOwner && !taskOwner && taskAssignee) {
		$('#taskcontent_' + task._id + ' .assignee-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' input.datepicker').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .repeat-time-value').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' .repeat-time-unit').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' select.hour-selector').attr('disabled','disabled');
		$('#taskcontent_' + task._id + ' select.minutes-selector').attr('disabled','disabled');
	}
	
	if ((task.duedate_ts != null) && (task.duedate_ts != ''))
		return task.duedate_ts;
	else
		return null;
}
Template.task.dueDate = function() {
	return updateDueDateAndAlert(this);
}

var updateAssignee = function(task) {
	if (task.assignees == null) {
		$('#taskcontent_' + task._id + ' .assignee-selector').val('');
		return '';
	}
	else {
		if (task.assignees.length > 0) {
			$('#taskcontent_' + task._id + ' .assignee-selector option').each(function() {
				this.selected = (this.text == task.assignees[0]);
			});
			return task.assignees[0];
		}
		else {
			$('#taskcontent_' + task._id + ' .assignee-selector').val('');
			return '';
		}
	}
}
Template.task.assignee = function() {
	return updateAssignee(this);
}

var updateComments = function(task) {
	// Comments
	if (task.comments != null) {
		$('#taskcontent_' + task._id + ' .comments-area').val(task.comments);
		return true;
	}
	else {
		$('#taskcontent_' + task._id + ' .comments-area').val();
		return false;
	}
}
Template.task.thereAreComments = function() {
	return updateComments(this);
}

Template.task.events({
	'blur .task-container textarea.input-task-name': function(e) {
		var taskId = this._id; //$(e.target).attr('data-task-id');
		var taskNameCurr = $(e.target).val();
		var task = Tasks.findOne({_id: taskId});
		var list = Lists.findOne({_id: task.list});
		var taskOwnerId = task.owner;
		var listOwnerId = list.owner;
		var userId = Meteor.userId();
		var taskNameOld = task.name;

		if (taskNameCurr != taskNameOld) {
			if (userId != taskOwnerId && userId != list.owner) {
				alert("I am sorry you can't modify the task name. You need to be the owner of the list.");
				$(e.target).val(taskNameOld);
			}
			else {
				Tasks.update(taskId, {$set: {name: taskNameCurr}}, function(error) { 
					if (error) {
						alert(error.reason); 
					}
				});
			}
		}
	},
	
	'mouseenter .task': function(e) {
		$('#task_' + this._id + ' .task-remove-container').show();
		$('#task_' + this._id + ' .task-move-container').show();
	},
	
	'mouseleave .task': function(e) {
		$('#task_' + this._id + ' .task-remove-container').hide();
		$('#task_' + this._id + ' .task-move-container').hide();
	},
	
	'click .glyphicon-arrow-up.icon-black': function(e) {
		var list = Lists.findOne({_id: this.list, owner: Meteor.userId()});
		if (!list) {
		// if (Meteor.userId() != this.owner && Meteor.userId() != this.assignee ) {
			alert("I am sorry you can't move the task.");
			return;
		}
		var el = $('#task_' + this._id);
		var upperTask = Tasks.findOne({list : Session.get("listId"), "rank" : (this.rank + 1)});
		if (!upperTask) {
			return;
		}

		Tasks.update(this._id, {$set: {rank: (this.rank + 1)}}, function(error) { 
			if (error) {
				alert(error.reason); 
			}
		});
		
		
		Tasks.update(upperTask._id, {$set: {rank: this.rank}}, function(error) { 
			if (error) {
				alert(error.reason); 
			}
		});
		$(el).mouseleave();
	},
	
	'click .glyphicon-arrow-down.icon-black': function(e) {
		var list = Lists.findOne({_id: this.list, owner: Meteor.userId()});
		if (!list) {
		// if (Meteor.userId() != this.owner && Meteor.userId() != this.assignee ) {
			alert("I am sorry you can't move the task.");
			return;
		}
		
		var lowerTask = Tasks.findOne({list : Session.get("listId"), "rank" : (this.rank - 1)});
		if (!lowerTask)
			return;
		
		Tasks.update(lowerTask._id, {$set: {rank: this.rank}}, function(error) { 
			if (error) {
				alert(error.reason); 
			}
		});
		Tasks.update(this._id, {$set: {rank: (this.rank - 1)}}, function(error) { 
			if (error) {
				alert(error.reason); 
			}
		});
	},
	
	'click .glyphicon-remove': function(e) {
		var list = Lists.findOne({_id: this.list, owner: Meteor.userId()});
		
		if (!this.removed) {
			if (!list && !(this.owner == Meteor.userId())) {
				alert("I am sorry you can't remove tasks.");
				return;
			}
			Tasks.update(this._id, {$set: {removed: true}}, function(error) { 
				if (error) {
					alert(error.reason); 
				}
			});
			Meteor.call('updateStatus', {taskId: this._id, newStatus: this.status}, function(error, ret) { 
				if (error)
					return alert(error.reason);
				// if user is not registered notify
				if (!ret)
					alert("I am sorry you can't modify the status.");
			});
		}
		else {
			if (!list) {
				alert("I am sorry only the owner of the list can remove tasks.");
				return;
			}
			Meteor.call('removeTask', this._id, function(error, ret) { 
				if (error)
					return alert(error.reason);
					
				// if user is not registered notify
				if (!ret)
					alert("Error in removing task.");
				else {
					var maxRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {"rank" : -1}})
					var minRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {"rank" : 0}})
					
					if (maxRankTask && minRankTask) {
						Session.set('maxRankTask', maxRankTask.rank);
						Session.set('minRankTask', minRankTask.rank );
					}
					else {
						Session.set('maxRankTask', 0);
						Session.set('minRankTask', 0);
					}
				}
			});
		}
	},
	
	'click .glyphicon-ok': function(e) {
		var list = Lists.findOne({_id: this.list, owner: Meteor.userId()});
		
		if (this.removed) {
			if (!list && !(this.owner == Meteor.userId())) {
				alert("I am sorry you can't remove tasks.");
				return;
			}
			Tasks.update(this._id, {$set: {removed: false}}, function(error) { 
				if (error) {
					alert(error.reason); 
				}
			});
			Meteor.call('updateStatus', {taskId: this._id, newStatus: this.status}, function(error, ret) { 
				if (error)
					return alert(error.reason);
				// if user is not registered notify
				if (!ret)
					alert("I am sorry you can't modify the status.");
			});
		}
	},
	
	'click .task-chevron-expandable': function(e, template) {
		var elemToAnimate = $('#taskcontent_' + this._id);
		if (!elemToAnimate.hasClass('in')) {
			elemToAnimate.removeClass('out');
			elemToAnimate.addClass('in');
			template.hasClassExpanded = true;
			curHeight = elemToAnimate.height(),
			autoHeight = elemToAnimate.css('height', 'auto').height();
			elemToAnimate.height(curHeight).animate({height: autoHeight}, 100);
			$('#task_' + this._id).addClass('expanded');
			$('#task_' + this._id + ' textarea').autosize({append: ''});
			var el = $(e.target).parent().find('span.glyphicon-chevron-left');
			el.removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-down');
		}
		else {
			elemToAnimate.removeClass('in');
			elemToAnimate.addClass('out');
			$('#task_' + this._id).removeClass('expanded');
			template.hasClassExpanded = false;
			elemToAnimate.height(curHeight).animate({height: 0}, 100);
			$('#task_' + this._id + ' textarea').trigger('autosize.destroy');
			var el = $(e.target).parent().find('span.glyphicon-chevron-down');
			el.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-left');
		}
	},
	
	'click .btn-status-completed': function(e) {
		var myStatus = 0;
		if ($(e.target).hasClass('active') == false) {
			var user = Meteor.user();
			var userEmail = user.email;
			var list = Lists.findOne({_id: this.list});
			
			if (user._id != this.owner && userEmail != this.assignees[0] && list.owner != user._id) {
				alert("I am sorry you can't modify the task status.");
			}
			else {
				Meteor.call('updateStatus', {taskId: this._id, newStatus: myStatus}, function(error, ret) { 
					if (error)
						return alert(error.reason);
					// if user is not registered notify
					if (!ret)
						alert("I am sorry you can't modify the status.");
				});
			}
		}
	},
	
	'click .btn-status-later': function(e) {
		var myStatus = 1;
		if ($(e.target).hasClass('active') == false) {
			var user = Meteor.user();
			var userEmail = user.email;
			var list = Lists.findOne({_id: this.list});
			
			if (user._id != this.owner && userEmail != this.assignees[0] && list.owner != user._id) {
				alert("I am sorry you can't modify the task status.");
			}
			else {
				Meteor.call('updateStatus', {taskId: this._id, newStatus: myStatus}, function(error, ret) { 
					if (error)
						return alert(error.reason);
					if (!ret) 
						alert("I am sorry you can't modify the status.");
				});
			}
		}
	},
	
	'click .btn-status-soon': function(e) {
		var myStatus = 2;
		if ($(e.target).hasClass('active') == false) {
			var user = Meteor.user();
			var userEmail = user.email;
			var list = Lists.findOne({_id: this.list});
			
			if (user._id != this.owner && userEmail != this.assignees[0] && list.owner != user._id) {
				alert("I am sorry you can't modify the task status.");
			}
			else {
				Meteor.call('updateStatus', {taskId: this._id, newStatus: myStatus}, function(error, ret) { 
					if (error)
						return alert(error.reason);
					// if user is not registered notify
					if (!ret)
						alert("I am sorry you can't modify the status.");
				});
			}
		}
	},
	
	'click .btn-status-urgent': function(e) {
		var myStatus = 3;
		if ($(e.target).hasClass('active') == false) {
			var user = Meteor.user();
			var userEmail = user.email;
			var list = Lists.findOne({_id: this.list});
			
			if (user._id != this.owner && userEmail != this.assignees[0] && list.owner != user._id) {
				alert("I am sorry you can't modify the task status.");
			}
			else {
				Meteor.call('updateStatus', {taskId: this._id, newStatus: myStatus}, function(error, ret) { 
					if (error)
						return alert(error.reason);
					// if user is not registered notify
					if (!ret)
						alert("I am sorry you can't modify the status.");
				});
			}
		}
		
	},
	
	'change .assignee-selector': function(e, template) {	
		var assignee = $('#taskcontent_' + this._id + ' .assignee-selector').val();
		
		if (assignee == '') {
			assignee = null;
			Tasks.update(this._id, {$set: {assignees: [assignee]}},
				function(error) { 
					if (error) {
						alert(error.reason); 
					}
				}
			);
			return;
		}
		
		var taskId = this._id;
		if ( _.indexOf(this.assignees, assignee ) == -1) {
			Tasks.update(this._id, {$set: {assignees: [assignee]}},
				function(error) { 
					if (error) {
						alert(error.reason); 
					}
					else {
						var user = Meteor.user();
 						var userEmail = user.email;
 						if (userEmail == assignee)
 							return;
 						
						Meteor.call('addAssignedTaskEmailNotification',
							{recipient: assignee, taskId: taskId}, 
							function(error, ret) { 
							if (error)
								return alert(error.reason);
							
							if (!ret) {
								alert(assignee + ' is not a registered user yet.');
							}
							else {
								alert(assignee + ' has been notified.');
							}
						});
						Meteor.call('addAssignedTaskPopupNotification',
							{recipient: assignee, taskId: taskId}, 
							function(error, ret) { 
							if (error)
								return alert(error.reason);
						});
					}
				}
			);
		}
		else {
			// throw new Meteor.Error(401, "Already sharing with the user.");
		}	
	},
	
	'change .alert-email': function(e, template) {
		var emailVal = $('#taskcontent_' + this._id + ' .alert-email').prop('checked');
		var notificationVal = $('#taskcontent_' + this._id + ' .alert-notification').prop('checked');
		
		if (emailVal || notificationVal) {
			$('#taskcontent_' + this._id + ' .value-before').prop('disabled', false);
			$('#taskcontent_' + this._id + ' .time-unit-before').prop('disabled', false);
			$('#taskcontent_' + this._id + ' #alert-set.btn-set').prop('disabled', false);
			$('#taskcontent_' + this._id + ' #alert-unset.btn-set').prop('disabled', true);
		}
		else {
			$('#taskcontent_' + this._id + ' .value-before').prop('disabled', true);
			$('#taskcontent_' + this._id + ' .time-unit-before').prop('disabled', true);
			$('#taskcontent_' + this._id + ' #alert-set.btn-set').prop('disabled', true);
			$('#taskcontent_' + this._id + ' #alert-unset.btn-set').prop('disabled', true);
		}
	},
	
	'change .alert-notification': function(e, template) {
		var emailVal = $('#taskcontent_' + this._id + ' .alert-email').prop('checked');
		var notificationVal = $('#taskcontent_' + this._id + ' .alert-notification').prop('checked');
		
		if (emailVal || notificationVal) {
			$('#taskcontent_' + this._id + ' .value-before').prop('disabled', false);
			$('#taskcontent_' + this._id + ' .time-unit-before').prop('disabled', false);
			$('#taskcontent_' + this._id + ' #alert-set.btn-set').prop('disabled', false);
			$('#taskcontent_' + this._id + ' #alert-unset.btn-set').prop('disabled', true);
		}
		else {
			$('#taskcontent_' + this._id + ' .value-before').prop('disabled', true);
			$('#taskcontent_' + this._id + ' .time-unit-before').prop('disabled', true);
			$('#taskcontent_' + this._id + ' #alert-set.btn-set').prop('disabled', true);
			$('#taskcontent_' + this._id + ' #alert-unset.btn-set').prop('disabled', true);
		}
	},
	
	'change .repeat-time-unit': function(e, template) {
		var timeUnitBeforeVal = $('#taskcontent_' + this._id + ' .repeat-time-unit').val();
		if (timeUnitBeforeVal == 'never') {
			$('#taskcontent_' + this._id + ' .repeat-time-value').val('');
		}
	},
	
	'blur .value-before': function(e, template) {
		var valueBeforeVal = $('#taskcontent_' + this._id + ' .value-before').val();
		var emailVal = $('#taskcontent_' + this._id + ' .alert-email').prop('checked');
		var notificationVal = $('#taskcontent_' + this._id + ' .alert-notification').prop('checked');
		if (valueBeforeVal == '' || !(!isNaN(parseFloat(valueBeforeVal))  && isFinite(valueBeforeVal)) ) {
			$('#taskcontent_' + this._id + ' .value-before').val(null);
			$('#taskcontent_' + this._id + ' .value-before').addClass('input-error');
			return;
		} else {
			$('#taskcontent_' + this._id + ' .value-before').removeClass('input-error');
			if (emailVal || notificationVal) {
				$('#taskcontent_' + this._id + ' #alert-set.btn-set').prop('disabled', false);
				$('#taskcontent_' + this._id + ' #alert-unset.btn-set').prop('disabled', true);
			}
		}		
	},
		
	'click #due-date-set': function(e, template) {
		var calendar  = $('#taskcontent_' + this._id + ' input.datepicker').val();
		if (this.lastDateSelected != calendar) {
			this.lastDateSelected = calendar;
			var dateStringParts = this.lastDateSelected.split('/');
			if(dateStringParts.length < 3) {
				$('#taskcontent_' + this._id + ' input.datepicker').addClass('input-error');
				return;
			}
			
			var newDate = new Date(dateStringParts[2], parseInt(dateStringParts[1]) - 1, dateStringParts[0]);
			var hours = parseInt($('#taskcontent_' + this._id + ' select.hour-selector').val());
			var minutes = parseInt($('#taskcontent_' + this._id + ' select.minutes-selector').val());
			if (!isNaN(newDate) && !isNaN(hours) && !isNaN(minutes)) {
				var tsDate = newDate.getTime() + hours*60*60*1000 + minutes*60*1000;				
				var repeatTimeValue = parseInt($('#taskcontent_' + this._id + ' .repeat-time-value').val());
				var repeatTimeUnitVal = $('#taskcontent_' + this._id + ' .repeat-time-unit').val();
				
				$('#taskcontent_' + this._id + ' .repeat-time-value').val('');
				
				var deltaDate = 0;
				switch(repeatTimeUnitVal) {
					case 'minutes': 
						deltaDate = repeatTimeValue*60*1000
						break;
					case 'hours': 
						deltaDate = repeatTimeValue*60*60*1000
						break;
					case 'days':
						deltaDate = repeatTimeValue*24*60*60*1000
						break;
					case 'weeks': 
						deltaDate = repeatTimeValue*24*60*60*1000
						break;
					case 'months': 
						deltaDate = repeatTimeValue*30*24*60*60*1000
						break;
				};
				if  (!isNaN(repeatTimeValue)) {
					var nextDueDate = tsDate + deltaDate;
					Tasks.update(this._id, {$set: {
						repeatduedate_ts: nextDueDate,
						repeat_time_value: repeatTimeValue, 
						repeat_time_unit: repeatTimeUnitVal,						
						duedate_ts: tsDate }}, 
						function(error) { 
							if (error) {
								alert(error.reason); 
							}
					});
				} else {
					Tasks.update(this._id, {$set: {
						duedate_ts: tsDate }}, 
						function(error) { 
							if (error) {
								alert(error.reason); 
							}
					});
				}
				
				Meteor.call('addDueDateSchedule', 
					{taskId: this._id, dueDate_ts: tsDate},
					function(error, ret) { 
					if (error)
						return alert(error.reason);
				});
			} // end if(date format valid)
			else {
				if (!isNaN(newDate)){	
					$('#taskcontent_' + this._id + ' input.datepicker').addClass('input-error');
				}
			}
		}		
	},
	
	'click #due-date-unset': function(e, template) {
		if (this.email != false) {
			Meteor.call('removeAlertEmailNotification', this._id,
				function(error, ret) { 
					if (error)
						return alert(error.reason);
				}
			);
		}
		
		if (this.notification != false) {
			Meteor.call('removeAlertPopupNotification', this._id,
				function(error, ret) { 
					if (error)
						return alert(error.reason);
				}
			);
		}
		
		Meteor.call('removeDueDateSchedule', this._id,
			function(error, ret) { 
			if (error)
				return alert(error.reason);
		});
		
		Tasks.update(this._id, 
			{ $set:
				{
					duedate_ts: null, 
					repeatduedate_ts: null,
					repeat_time_value: null, 
					repeat_time_unit: null,
					alertdate_ts: null,
					email: false,
					notification: false,
					value_before: null,
					time_unit_before: null
				}
			},
			function(error) { 
				if (error) {
					alert(error.reason); 
				}
			}
		);
	},
			
	'click #alert-set': function(e, template) {
		var email = $('#taskcontent_' + this._id + ' .alert-email').prop('checked');
		var notification = $('#taskcontent_' + this._id + ' .alert-notification').prop('checked');
 		var valueBefore = $('#taskcontent_' + this._id + ' .value-before').val();
 		var timeUnitBefore = $('#taskcontent_' + this._id + ' .time-unit-before').val();

		if (valueBefore == null || valueBefore == '' || 
			!(!isNaN(parseFloat(valueBefore))  && isFinite(valueBefore)) ) {
			$('#taskcontent_' + this._id + ' .value-before').addClass('input-error');
			return;
		}
		if ((email != false || notification != false) && 
			this.duedate_ts != null && 
			valueBefore != null && timeUnitBefore != null) {
			var newAlertDate_ts = this.duedate_ts;
			switch(this.time_unit_before) {
				case 'minutes': 
					newAlertDate_ts = newAlertDate_ts - this.value_before*60*1000
					break;
				case 'hours': 
					newAlertDate_ts = newAlertDate_ts - this.value_before*60*60*1000
					break;
				case 'days':
					newAlertDate_ts = newAlertDate_ts - this.value_before*24*60*60*1000
					break;
				case 'weeks': 
					newAlertDate_ts = newAlertDate_ts - this.value_before*24*60*60*1000
					break;
				case 'months': 
					newAlertDate_ts = newAlertDate_ts - this.value_before*30*24*60*60*1000
					break;
			};
			
			Tasks.update(this._id, 
				{ $set: 
					{
						alertdate_ts: newAlertDate_ts,
						email: email,
						notification: notification,
						value_before: valueBefore,
						time_unit_before: timeUnitBefore
					}
				},
				function(error) { 
					if (error) {
						alert(error.reason); 
					}
				}
			);
			
			if (email != false) {
				Meteor.call('addAlertEmailNotification',
					{taskId: this._id, alertDate_ts: newAlertDate_ts}, 
					function(error, ret) { 
					if (error)
						return alert(error.reason);
				});
			}
			
			if (notification != false) {
				Meteor.call('addAlertPopupNotification',
					{taskId: this._id, alertDate_ts: newAlertDate_ts}, 
					function(error, ret) { 
					if (error)
						return alert(error.reason);
				});
			}
			
		}
		
	},
	
	'click #alert-unset': function(e, template) {
		if (this.email != false) {
			Meteor.call('removeAlertEmailNotification', this._id,
				function(error, ret) { 
					if (error)
						return alert(error.reason);
				}
			);
		}
		
		if (this.notification != false) {
			Meteor.call('removeAlertPopupNotification', this._id,
				function(error, ret) { 
					if (error)
						return alert(error.reason);
				}
			);
		}
			
		Tasks.update(this._id, 
			{ $set:
				{
					alertdate_ts: null,
					email: false,
					notification: false,
					value_before: null,
					time_unit_before: null
				 }
			},
			function(error) { 
				if (error) {
					alert(error.reason); 
				}
			}
		);
			
	},
	
	'blur .comments-area': function(e, template) {
		var commentsVal = $('#taskcontent_' + this._id + ' .comments-area').val();
		if (commentsVal != null) {
			Tasks.update(this._id, {$set: {comments: commentsVal}}, function(error) { 
				if (error) {
					alert(error.reason); 
				}
			});
		}
	},

});

Template.task.listName = function() {
	var user = Meteor.user();
	var userEmail = user.email;
	
	var list = Lists.findOne({_id: this.list, stakeholderEmails: userEmail});
	if (list != null) {
		return list.name
	}
	else {
		return null;		
	}
}

Template.task.cannotModify = function() {
	var list = Lists.findOne({_id: this.list, owner: Meteor.userId()});
	var task = Tasks.findOne({_id: this._id, owner: Meteor.userId()});
	if (list || task)
		return false;
	else
		return true;
}

Template.task.cannotMove = function() {
	var list = Lists.findOne({_id: this.list, owner: Meteor.userId()});
	if (list)
		return false;
	else
		return true;
}

Template.task.isFirstTask = function() {
	var taskRank = this.rank;
	var maxRankTask = Session.get("maxRankTask");
	if (maxRankTask ==  taskRank) {
		return true;
	}
	else {
		return false;
	}
}

Template.task.isLastTask = function() {
	var taskRank = this.rank;
	var minRankTask = Session.get("minRankTask");
	if (minRankTask ==  taskRank) {
		return true;
	}
	else
		return false;
}

Template.task.hasDueDate = function() {
	if (this.duedate_ts)
		return true;
	else
		return false;
}

Template.task.hasRepeatDueDate = function() {
	if (this.repeatduedate_ts)
		return true;
	else
		return false;
}

Template.task.repeatDueDate = function() {
	if (this.repeatduedate_ts != null) {
		var repeatduedate = new Date(this.repeatduedate_ts);
		var repeatduedateStr = pad(repeatduedate.getDate(), 2) + "/" 
									+ pad((repeatduedate.getMonth() + 1),2)
									+ "/" + (repeatduedate.getYear()+1900)
									+ " " + pad(repeatduedate.getHours(),2)
									+ ":" + pad(repeatduedate.getMinutes(),2);
			return repeatduedateStr;
	}
	else
		return "";
}

Template.task.hasAlertDate = function() {
	if (this.alertdate_ts)
		return true;
	else
		return false;
}

Template.task.isTaskOwner = function() {
	var user = Meteor.userId();
	if (this.owner == user)
		return true;
	else
		return false;
	// var list = Lists.findOne({_id: this.list, owner: });
}

Template.task.isTaskAssignee = function() {
	var user = Meteor.user();
	var userEmail = user.email;
	
	if (this.assignees == null)
		return false;
		
	if (this.assignees[0] == userEmail)
		return true;
	else
		return false;
}

function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length-size);
}
