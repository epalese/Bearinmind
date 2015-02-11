/*
Accounts.config(
	{sendVerificationEmail: true}
);
*/

Accounts.onCreateUser(function(options, user) {
	if (user) {
		user.email = user.emails[0].address.toLowerCase();
		Email.send({
			to: 'leleplx@gmail.com',
			from: 'thebutler@bearinmind.eu',
			subject: 'Created new user: ' + user.emails[0].address,
			text: ''
		});
	}
	return user;
});

if (Meteor.isServer) {
	console.log('Configuring cron jobs...');
	var MyCron = new Cron(/* interval in milliseconds, defaults to 60000 (1 minute) */);

	// 5 is the number of intervals between invoking the job
  	// so this job will happen once every 5 minute  
  	
  	// emails
  	MyCron.addJob(1, function() {
  		var current_ts = (new Date()).getTime();
  		var before_current_ts = current_ts - 120*1000;
  		var notifics = EmailNotificationsQueue.find(
  			{ $and:
  				[ 
					{fired_ts: null}, 
					{fire_ts: {'$lte': current_ts, '$gte': before_current_ts}}
  				]
  			}
  		).fetch();
		console.log('[mycron:EmailNotificationsQueue] emails to send: ' + notifics.length);
  		for (var i = 0; i < notifics.length; i++) {
  			var notific = notifics[i];

  			if (notific.to != null) {
  				var task = Tasks.findOne({_id: notific.taskId});
				var curObject = notific.object;
				var senderEmail = 'thebutler@bearinmind.eu';
				console.log('[mycron:EmailNotificationsQueue] notification.from: ' + notific.from);
				console.log('[mycron:EmailNotificationsQueue] notification.to: ' + notific.to);
				console.log('[mycron:EmailNotificationsQueue] notification.subject: ' + notific.subject);
				console.log('[mycron:EmailNotificationsQueue] notification.object: ' + curObject);
				Meteor.call('sendEmail',
					notific.to,
					senderEmail,
					notific.subject,
					curObject);
// 				Tasks.update(notific.taskId, {$set: {alertdate_ts: null}}, null);
				EmailNotificationsQueue.update(notific._id, {$set: {'fired_ts': current_ts}}, null);
				console.log('[mycron:EmailNotificationsQueue] email with to != null enqueued.' + notific._id);
  			}
  			
  			// notify alerts for tasks to every sharer
  			if (notific.listId != null && notific.to == null) {
  				var list = Lists.findOne({_id: notific.listId});
  				// *** NOTE ***
  				// set ownerEmail to null or a different address of the sender if
  				// you want to send the email to every stakeholder 
  				var ownerEmail = notific.from;
  				var senderEmail = 'thebutler@bearinmind.eu';
  				list.stakeholderEmails.forEach(
					function(userEmail) {
						if (ownerEmail != userEmail) {
							var curObject = notific.object.replace('${username}', userEmail);
							console.log('[mycron:EmailNotificationsQueue] notification.from: ' + senderEmail);
							console.log('[mycron:EmailNotificationsQueue] notification.to: ' + userEmail);
							console.log('[mycron:EmailNotificationsQueue] notification.subject: ' + notific.subject);
							console.log('[mycron:EmailNotificationsQueue] notification.object: ' + curObject);
							Meteor.call('sendEmail',
								userEmail,
								senderEmail,
								notific.subject,
								curObject);
						}
					}
				);
// 				Tasks.update(notific.taskId, {$set: {alertdate_ts: null}}, null);
				EmailNotificationsQueue.update(notific._id, {$set: {'fired_ts': current_ts}}, null);
				console.log('[mycron:EmailNotificationsQueue] email with to == null enqueued.' + notific._id);
  			}
  			
  		}
  		
    	console.log('[mycron:EmailNotificationsQueue] wait until next schedule');
  	});
  	
  	// popups
  	MyCron.addJob(1, function() {
  		var current_ts = (new Date()).getTime();
  		var before_current_ts = current_ts - 120*1000;
  		var notifics = PopupNotificationsQueue.find(
  			{ $and:
  				[ 
  					{fired_ts: null}, 
  					{fire_ts: {'$lte': current_ts, '$gte': before_current_ts}}
  				]
  			}
  		).fetch();
		console.log('[mycron:PopupNotificationsQueue] notifications to show: ' + notifics.length);
  		for (var i = 0; i < notifics.length; i++) {
  			var notific = notifics[i];
  			console.log('[mycron:PopupNotificationsQueue] notification.from: ' + notific.from);
  			console.log('[mycron:PopupNotificationsQueue] notification.text: ' + notific.text);
  			var task = Tasks.findOne({_id: notific.taskId});
  			task.stakeholderEmails.forEach(
  				function(userEmail) {
  					console.log('[mycron:PopupNotificationsQueue] notification.to: ' + userEmail);
  					var pNot = {
						from: notific.from,
						to: userEmail,
						listId: notific.listId,
						taskId: notific.taskId,
						text: notific.text,
						created_ts: notific.created_ts,
						fire_ts: notific.fire_ts,
						fired_ts: null
					}
					var pNotId = PopupNotifications.insert(pNot);
  				}
  			);
			PopupNotificationsQueue.update(notific._id, {$set: {'fired_ts': current_ts}}, null);
// 			Tasks.update(notific.taskId, {$set: {alertdate_ts: null}}, null);
			console.log('[mycron:EmailNotificationsQueue] notification enqueued: ' + notific.text);
  		}
  		
    	console.log('[mycron:PopupNotificationsQueue] wait until next schedule');
  	});
  	
  	// due dates
  	MyCron.addJob(1, function() {
  		var current_ts = (new Date()).getTime();
  		var before_current_ts = current_ts - 120*1000;
  		var notifics = DueDateQueue.find(
  			{ $and:
  				[ 
  					{fired_ts: null}, 
  					{fire_ts: {'$lte': current_ts, '$gte': before_current_ts}}
  				]
  			}
  		).fetch();
		console.log('[mycron:DueDateQueue] notifications to update: ' + notifics.length);
  		for (var i = 0; i < notifics.length; i++) {
  			var notific = notifics[i];
  			console.log('[mycron:DueDateQueue] duedate.taskid: ' + notific.taskId);
  			console.log('[mycron:DueDateQueue] duedate.duedate_ts: ' + notific.duedate_ts);
  			var task = Tasks.findOne({_id: notific.taskId});
			if (!task) return;
			
			// TODO: check in list properties if user want to change status of the task
			// when due date expires
			
			// check if is a recurrent task
			var repeatTimeUnitVal = task.repeat_time_unit;
			var repeatTimeValue = task.repeat_time_value;
			if (!isNaN(repeatTimeValue) && repeatTimeUnitVal) {
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
					default:
						deltaDate = 0;
						break;
				};
				
				if  (deltaDate > 0) {
					var nextDueDate = task.duedate_ts + deltaDate;
					var nextRepeatDueDate = task.duedate_ts + deltaDate + deltaDate;
					
					var newalertdate_ts = null;
					if (task.value_before != null 
						&& task.time_unit_before != null) {
						var newAlertDate_ts = nextDueDate;
						switch(task.time_unit_before) {
							case 'minutes': 
								newAlertDate_ts = newAlertDate_ts - task.value_before*60*1000
								break;
							case 'hours': 
								newAlertDate_ts = newAlertDate_ts - task.value_before*60*60*1000
								break;
							case 'days':
								newAlertDate_ts = newAlertDate_ts - task.value_before*24*60*60*1000
								break;
							case 'weeks': 
								newAlertDate_ts = newAlertDate_ts - task.value_before*24*60*60*1000
								break;
							case 'months': 
								newAlertDate_ts = newAlertDate_ts - task.value_before*30*24*60*60*1000
								break;
						};
					}
					
					Tasks.update(task._id, {$set: {
						repeatduedate_ts: nextRepeatDueDate,
						repeat_time_value: repeatTimeValue, 
						repeat_time_unit: repeatTimeUnitVal,						
						duedate_ts: nextDueDate,
						alertdate_ts: newAlertDate_ts }}, 
						function(error) { 
							if (error) {
								alert(error.reason); 
							}
					});
					
					if (task.email) {
						emailNot = EmailNotificationsQueue.findOne({taskId: task._id});
						if (emailNot) {
							console.log('[mycron:DueDateQueue] email notification ' + emailNot._id + 
								'; fire_ts: ' + newAlertDate_ts);
							console.log('email: ' + emailNot._id);
							EmailNotificationsQueue.update(emailNot._id, {$set: {
								fire_ts: newAlertDate_ts,
								fired_ts: null}}, 
								function(error) { 
									if (error) {
										alert(error.reason); 
									}
							});
						}
					}
					
					if (task.notification) {
						popupNot = PopupNotificationsQueue.findOne({taskId: task._id});
						if (popupNot) {
							console.log('[mycron:DueDateQueue] popup notification ' + popupNot._id + 
								'; fire_ts: ' + newAlertDate_ts);
							PopupNotificationsQueue.update(popupNot._id, {$set: {
								fire_ts: newAlertDate_ts,
								fired_ts: null}}, 
								function(error) { 
									if (error) {
										alert(error.reason); 
									}
							});
						}
					}
					
					console.log('[mycron:DueDateQueue] (' + notific.taskId + ') next duedate: ' + nextDueDate 
						+ '; next repeat date: ' + nextRepeatDueDate + '; next alert date: '
						+ newAlertDate_ts);
						
					DueDateQueue.update(notific._id, {$set: {'fire_ts': nextDueDate}}, null);	
				}
				else {
					DueDateQueue.update(notific._id, {$set: {'fired_ts': current_ts}}, null);
				}
			}
			else {
				DueDateQueue.update(notific._id, {$set: {'fired_ts': current_ts}}, null);
			}
  		}
  		
    	console.log('[mycron:DueDateQueue] wait until next schedule');
  	});
}

if (Meteor.isServer) {
	Meteor.methods({
		sendEmail: function (to, from, subject, text) {
			check([to, from, subject, text], [String]);

			// Let other method calls from the same client start running,
			// without waiting for the email sending to complete.
			this.unblock();
			console.log('[utility.sendEmail] ' + to + ' ' + from + ' ' + subject + ' ' + text);
			Email.send({
				to: to,
				from: from,
				subject: subject,
				text: text
			});
		},
		
		/*
		Get all the stakeholder emails for a list.
		*/
		stakeholderEmails: function(listId) {
			if (listId == null)
				throw new Meteor.Error(401, "Error: can't access to list sharing data.");
			
			var user = Meteor.user();

			// ensure the user is logged in and is the owner of the list
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
			//var userEmail = user.emails[0].address;
			var userEmail = user.email;
			var list = Lists.findOne({_id: listId});
			if (list == null)
				return [];
			var iAmTheOwner = (list.owner == user._id) ? true : false;
			
			if ( _.indexOf( list.stakeholderEmails, userEmail ) == -1) {
// 				throw new Meteor.Error(401, "You need to be in the share list.");
				return null;
			}
				
			var stakeholderEmails = list.stakeholderEmails;
			if (!stakeholderEmails)
				throw new Meteor.Error(401, "Error: can't access to list sharing data.");

			var checkedStakeholderEmails = [];
			for (var i = 0; i < stakeholderEmails.length; i++) {
				//if (user.emails[0].address != stakeholderEmails[i]) {
				if (user.email != stakeholderEmails[i]) {
					var sharer = Meteor.users.findOne({ email: stakeholderEmails[i] });
					if (sharer)
						checkedStakeholderEmails.push({email: sharer.email, iam: false, exist: true});
					else
						checkedStakeholderEmails.push({email: stakeholderEmails[i], iam: false, exist: false});
				}
				else {
// 					if (iAmTheOwner)
// 						checkedStakeholderEmails.push({email: stakeholderEmails[i], iam: true, exist: true});
// 					else
					checkedStakeholderEmails.push({email: stakeholderEmails[i], iam: true, exist: true});
				}
			}
					
			return checkedStakeholderEmails; 
		},
		
		removeList: function(listId) {
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
			var list = Lists.findOne(listId);
			if (!list)
				throw new Meteor.Error(401, "You can't remove the list.");
				
			Tasks.remove({list: list._id});
			Lists.remove({_id: list._id});
			return;
		},

		shareList: function(params) {
			var listId = params.listId;
			var userEmail = params.email;
			
			if (!listId || !userEmail)
				throw new Meteor.Error(401, "Error in sharing the list.");
			
			if (_.isString(userEmail)) {
				userEmail = userEmail.toLowerCase().trim();
			}
			else
				throw new Meteor.Error(401, "Error in sharing the list.");
				
			var user = Meteor.user();

			// ensure the user is logged in and is the owner of the list
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
			
			// console.log("utility.js->shareList: user " + user._id);
			var list = Lists.findOne({_id: listId, owner: user._id});
			if (!list)
				throw new Meteor.Error(401, "You need to be the owner of the list.");
			
			// if user already exists in the share list
			if ( _.indexOf( list.stakeholderEmails, userEmail ) != -1) {
				throw new Meteor.Error(401, "Already sharing with the user.");
			}
				
			Lists.update(list._id, {$push: {stakeholderEmails: userEmail}}, null);
			var tasks = Tasks.find({list: list._id});
			if (tasks == null)
				throw new Meteor.Error(401, "Error during the sharing of the list.");
			
			tasks.forEach(function(task) {
				Tasks.update(task._id, {$push: {stakeholderEmails: userEmail}},
					function(error) { 
						if (error) {
							alert(error.reason); 
						}
					});
				console.log('collection sharelist taskid = ' + task._id);
			});
		
			// find user by email
			var sharer = Meteor.users.findOne({ email: userEmail });
			if (sharer) {
				// notify
				Meteor.call('addSharedListEmailNotification', userEmail, listId);
				Meteor.call('addSharedListPopupNotification', userEmail, listId);
			}
			else {
				// send email to login
				Meteor.call('addSharedListNewUserEmailNotification', userEmail, listId);
			}
		
			return !!sharer;
		},
		
		/*
		Remove the specified user from the sharing list of users.
		*/
		unshareList: function(params) {
			var listId = params.listId;
			var unshareUserEmail = params.email;
			
			// console.log("utility.js->unshareList: list " + listId);
			// console.log("utility.js->unshareList: userEmail " + userEmail);
			if (!listId || !unshareUserEmail)
				throw new Meteor.Error(401, "Error in sharing the list.");
		
			var user = Meteor.user();
			var userEmail = user.email;

			// ensure the user is logged in and is the owner of the list
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
			
			// console.log("utility.js->shareList: user " + user._id);
			var list = Lists.findOne({_id: listId});
			if (!list)
				throw new Meteor.Error(401, "Error: the list is not correct.");
			
			// can't unshare one own list
			if (list.owner == user._id && unshareUserEmail == userEmail)
				throw new Meteor.Error(401, "You are the owner. You can't unshare the list.");
				
			// an user removing is sharing from a not owning list
			// the list owner that is removing someone from the sharing list
			if ( (list.owner != user._id  && unshareUserEmail == userEmail) ||
				list.owner == user._id ) {
				// if user already exists in the share list
				if ( _.indexOf( list.stakeholderEmails, unshareUserEmail ) == -1) {
					throw new Meteor.Error(401, "The user is not in the sharing list.");
				}
				
				Lists.update(list._id, {$pull: {stakeholderEmails: unshareUserEmail}}, null);
				var tasks = Tasks.find({list: list._id});
				tasks.forEach(function(task) {
					console.log("utility.js->unshareList: task " + task._id + " email: " + userEmail);
					Tasks.update(task._id, {$pull: {stakeholderEmails: unshareUserEmail}}, function(error) { 
						if (error) {
							alert(error.reason); 
						}
					});
				});
				
				// if the user removes himself from the sharing list notify the owner
				if (list.owner != user._id  && unshareUserEmail == userEmail) {
					Meteor.call('addUnsharedListPopupNotification',
						unshareUserEmail,
						listId);
				}
			}
			else
				throw new Meteor.Error(401, "You can't unshare the list.");
		},
		
		/* params:
		to: recipient of the email
		listId: id of the shared list
		*/
		addSharedListEmailNotification: function(recipient, listId) {
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");

			var recipientId = Meteor.users.findOne({ email: recipient });
			if (!recipientId)
				throw new Meteor.Error(401, "The recipient must be an existing user.");
				
			var list = Lists.findOne({_id: listId, owner: user._id, stakeholderEmails : recipient});
			if (!list)
				throw new Meteor.Error(401, "You need to be the owner of the list.");
				
			var senderEmail = user.email;
			var curSubject = 'Join ' + list.name + ' on Bear in Mind';
			var curObject = 'Hi ' + recipient + ',\n' + // 'Hi ' + recipient + ',\n' +
						senderEmail + ' would like to share a list with you.\n' +
						'Visit www.bearinmind.eu and see what is there for you.\n' + 
						'\nThe Bear in Mind team';
			var eNot = {
				from: senderEmail, // 'bearinmind@pearideas.com',
				to: recipient,
				listId: listId,
				taskId: null,
				subject: curSubject,
				object: curObject,
				created_ts: (new Date()).getTime(),
				fire_ts: (new Date()).getTime() + 60*1000,
				fired_ts: null
			}
			var eNotId = EmailNotificationsQueue.insert(eNot);
			
			return !!eNotId;
			
		},
		
		addSharedListNewUserEmailNotification: function(recipient, listId) {
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");

			var recipientId = Meteor.users.findOne({ email: recipient });
			if (recipientId)
				throw new Meteor.Error(401, "The recipient must be an new user.");
				
			var list = Lists.findOne({_id: listId, owner: user._id, stakeholderEmails : recipient});
			if (!list)
				throw new Meteor.Error(401, "You need to be the owner of the list.");
				
			var senderEmail = user.email;
			var curSubject = 'Join ' + list.name + ' on Bear in Mind';
			var curObject = 'Hi ' + recipient + ',\n' +
						senderEmail + ' would like to share a list with you.\n' +
						'Register on www.bearinmind.eu and see what is there for you.\n' + 
						'\nThe Bear in Mind team';
			var eNot = {
				from: senderEmail, // 'bearinmind@pearideas.com',
				to: recipient,
				listId: listId,
				taskId: null,
				subject: curSubject,
				object: curObject,
				created_ts: (new Date()).getTime(),
				fire_ts: (new Date()).getTime() + 60*1000,
				fired_ts: null
			}
			var eNotId = EmailNotificationsQueue.insert(eNot);
			
			return !!eNotId;
		},
		
		addSharedListPopupNotification: function(recipient, listId) {
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
				
			
			var recipientId = Meteor.users.findOne({ email: recipient });
			if (!recipientId)
				throw new Meteor.Error(401, "The recipient must be an existing user.");

			var owner = user.email;
			
			if (owner != recipient) {
				console.log('[utility.addSharedListPopupEmailNotification] ' + owner + 
				' is sharing ' + listId + ' with ' + recipient);
				var list = Lists.findOne({_id: listId, owner: user._id, stakeholderEmails : recipient});
				if (!list)
					throw new Meteor.Error(401, "You need to be the owner of the list.");
				
				// TODO: check if the notification is already present and fired_ts is null
				// If this is the case do not add a new notification
				var pNot = {
					from: owner,
					to: recipient,
					listId: listId,
					taskId: null,
					text: owner + ' shared a list with you.',
					created_ts: (new Date()).getTime(),
					fire_ts: null,
					fired_ts: null
				}
				var pNotId = PopupNotifications.insert(pNot);
				
				return !!pNotId;
			}
		},
		
		addAssignedTaskEmailNotification: function(params) {
			var recipient = params.recipient;
			var taskId = params.taskId;
			
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");

			var recipientId = Meteor.users.findOne({ email: recipient });
			// if the recipient is not registered the email is not sent
			if (!recipientId)
				return false;

			var task = Tasks.findOne({_id: taskId}); // owner: user._id, stakeholderEmails : recipient});
			if (!task)
				throw new Meteor.Error(401, "Error! Task not valid.");
			
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Error. Task not valid.");
				
			if (list.owner != user._id &&  task.owner != user._id)
				throw new Meteor.Error(401, "I am sorry you can't assign tasks.");
			
			var owner = user.email;
			
			// If I assign the task to myself I don't want to see a notification
			if (owner != recipient) {
				var senderEmail = user.email;
				var curSubject = 'A task is waiting for you ' + 'on Bear in Mind';
				var curObject = 'Hi ' + recipient + ',\n' +
							senderEmail + ' have just assigned a task to you.\n' +
							'Login to www.bearinmind.eu to see it.\n' + 
							'\nThe Bear in Mind team';
				var eNot = {
					from: senderEmail, // 'bearinmind@pearideas.com',
					to: recipient,
					listId: task.list,
					taskId: task._id,
					subject: curSubject,
					object: curObject,
					created_ts: (new Date()).getTime(),
					fire_ts: (new Date()).getTime() + 60*1000,
					fired_ts: null
				}
				var eNotId = EmailNotificationsQueue.insert(eNot);
			
				return !!eNotId;
			}
			else {
				console.log('[utility.addAssignedTaskPopupNotification] ' + owner + 
				' is the same as ' + recipient);
				return true;
			}
		},
		
		addAssignedTaskPopupNotification: function(params) {
			var recipient = params.recipient;
			var taskId = params.taskId;
			
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");

			var recipientId = Meteor.users.findOne({ email: recipient });
			// if the recipient is not registered the email is not sent
			if (!recipientId)
				return false;

			var task = Tasks.findOne({_id: taskId});
			console.log(taskId);
			if (!task)
				throw new Meteor.Error(401, "Error! Task not valid1.");
			
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Error. Task not valid2.");
				
			if (list.owner != user._id &&  task.owner != user._id)
				throw new Meteor.Error(401, "I am sorry you can't assign tasks.");
			
			var owner = user.email;

			// If I assign the task to myself I don't want to see a notification
			if (owner != recipient) {
				console.log('[utility.addAssignedTaskPopupNotification] ' + owner + 
				' assigned the task' + taskId + ' to ' + recipient);

				var pNot = {
					from: owner,
					to: recipient,
					listId: list._id,
					taskId: null,
					text: owner + ' assigned a task to you.',
					created_ts: (new Date()).getTime(),
					fire_ts: null,
					fired_ts: null
				}
				var pNotId = PopupNotifications.insert(pNot);
				
				return !!pNotId;
			}
			else {
				console.log('[utility.addAssignedTaskPopupNotification] ' + owner + 
				' is the same as ' + recipient);
				return true;
			}
		},
		
		addUnsharedListPopupNotification: function(unsharerEmail, listId) {
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
				
			var unsharerId = Meteor.users.findOne({ email: unsharerEmail });
			if (!unsharerId)
				throw new Meteor.Error(401, "The recipient must be an existing user.");
			
			var list = Lists.findOne({_id: listId});
			if (list.owner == unsharerId) 
				throw new Meteor.Error(401, "The owner of the list can't be removed from the sharing list.");
			
			var owner = Meteor.users.findOne({_id: list.owner});
			if (!owner)
				throw new Meteor.Error(401, "Error in retrieving the list owner.");
			var ownerEmail = owner.email;
			
			if (ownerEmail != unsharerEmail) {
				console.log('[utility.addUnsharedListPopupNotification] ' + unsharerEmail + 
				' is leaving ' + listId);
				
				var pNot = {
					from: unsharerEmail,
					to: ownerEmail,
					listId: listId,
					taskId: null,
					text: unsharerEmail + ' left the list ' + list.name + '.',
					created_ts: (new Date()).getTime(),
					fire_ts: null,
					fired_ts: null
				}
				var pNotId = PopupNotifications.insert(pNot);

				return !!pNotId;
			}
		},
		
		/* params:
		*/
		removeTask: function(taskId) {
			console.log('taskid: ' + taskId);
			var user = Meteor.user();

			// ensure the user is logged in and is the owner of the list
			if (!user)
				throw new Meteor.Error(401, "You need to login.");
			
			// Only the owner of the list can remove tasks
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
			
			var list = Lists.findOne({_id: task.list, owner: user._id});
			if (!list)
				throw new Meteor.Error(401, "I am sorry only the owner of the list can remove tasks.");

			Tasks.remove({_id: taskId}, function(error) { 
				if (error) {
					throw new Meteor.Error(401, "Error in removing task.");
 				}
				else {
					var listId = task.list;
					var tasks = Tasks.find({list : listId}, {sort: {rank : 1}});
					var count = 0;
					tasks.forEach(function(task) {
						Tasks.update(task._id, {$set: {rank: count}}, function(error) { 
							if (error) {
								alert(error.reason); 
							}
						});
						count = count + 1;
					});
				}
			});
	
			return true;
		},
		
		addAlertEmailNotification: function(params) {
			var taskId = params.taskId;
			var alertDate_ts = params.alertDate_ts;
			
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id || task.assignees[0] == userEmail) {
				Tasks.update(taskId, {$set: {alertdate_ts: alertDate_ts}}, null);
			
				var senderEmail = user.email;
				var curSubject = 'Bear in Mind: Reminder for ' + task.name + ' in list ' + list.name;
				var curObject = 'Hi ${username},\n' +
					'the task ' + task.name + ' is going to end soon.\n' +
					'\nThe Bear in Mind team';
			
				var eNot = {
					from: 'thebutler@bearinmind.eu', // senderEmail, // 'bearinmind@pearideas.com',
					to: null,
					listId: task.list,
					taskId: task._id,
					subject: curSubject,
					object: curObject,
					created_ts: (new Date()).getTime(),
					fire_ts: alertDate_ts,
					fired_ts: null
				}
				var eNotId = EmailNotificationsQueue.insert(eNot);
			}
			else
				throw new Meteor.Error(401, "You can't set an alarm.");
				
		},
		
		removeAlertEmailNotification: function(taskId) {
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id || task.assignees[0] == userEmail) {
				var notifics = EmailNotificationsQueue.remove({taskId: task._id});
			}
		},
		
		addAlertPopupNotification: function(params) {
			var taskId = params.taskId;
			var alertDate_ts = params.alertDate_ts;
			
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id || task.assignees[0] == userEmail) {
				Tasks.update(taskId, {$set: {alertdate_ts: alertDate_ts}}, null);
			
				var pNot = {
					from: userEmail,
					to: null,
					listId: task.list,
					taskId: task._id,
					text: list.name + ': ' + task.name + ' is going to end soon.',
					created_ts: (new Date()).getTime(),
					fire_ts: alertDate_ts,
					fired_ts: null
				};
				var pNotId = PopupNotificationsQueue.insert(pNot);
			}
			else
				throw new Meteor.Error(401, "You can't set an alarm.");
		},
		
		removeAlertPopupNotification: function(taskId) {
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id || task.assignees[0] == userEmail) {
				var notifics = PopupNotificationsQueue.remove({taskId: task._id});
			}
		},
		
		addDueDateSchedule: function(params) {
			var taskId = params.taskId;
			var dueDate_ts = params.dueDate_ts;
			
			// ensure the user is logged in and is the owner of the list
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id) {
				var dueDateNot = {
					listId: task.list,
					taskId: task._id,
					duedate_ts: dueDate_ts,
					created_ts: (new Date()).getTime(),
					fire_ts: dueDate_ts,
					fired_ts: null
				}
				var dueDateNotId = DueDateQueue.insert(dueDateNot);
			}
			else {
				throw new Meteor.Error(401, "You can't set a due date.");
			}
		},
		
		removeDueDateSchedule: function(taskId) {
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id ) {
				var notifics = DueDateQueue.remove({taskId: task._id});
			}
		},
		
		updateStatus: function(params) {
			var taskId = params.taskId;
			var newStatus = params.newStatus;
			if (taskId == null ||  newStatus == null) {
				throw new Meteor.Error(401, "Error: you can't modify the status. 1");
			}
			
			if (isNaN(parseFloat(newStatus)) && !isFinite(newStatus)) {
// 			if (newStatus == '' || !(!isNaN(parseFloat(newStatus))  && isFinite(newStatus)) ) {
				throw new Meteor.Error(401, "Error: you can't modify the status. 2");
			}
				
			var user = Meteor.user();
			if (!user) {
				throw new Meteor.Error(401, "You must be logged in.");
			}
			var userEmail = user.email;
			
			var task = Tasks.findOne({_id: taskId});
			if (!task)
				throw new Meteor.Error(401, "Task not found.");
				
			var list = Lists.findOne({_id: task.list});
			if (!list)
				throw new Meteor.Error(401, "Task list not found.");
			
			if (list.owner == user._id || task.owner == user._id || task.assignees[0] == userEmail) {
				Tasks.update(task._id, {$set: {status: newStatus}}, function(error) { 
					if (error) {
						throw new Meteor.Error(401, error.reason);
					}
				});
				var allStatus = Tasks.find({list: list._id, removed: {$ne: true}}, {status: 1} );
				var newOverallStatus = null;
				allStatus.forEach(function(status) {
					newOverallStatus = Math.max(newOverallStatus, status.status);
				});
				Lists.update(list._id, {$set: {overallStatus: newOverallStatus}}, function(error) { 
 					if (error) {
 						throw new Meteor.Error(401, error.reason);
 					}
 				}); 
 				return true;
			}
			else {
				return false
			}
		},
		
	});
}