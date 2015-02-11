// if the database is empty on server start, create some sample data.
/*
Meteor.startup(function () {
  if (Lists.find().count() === 0) {
  	// create two users
	var emanueleId = Accounts.createUser({
        email: 'leleplx@gmail.com',
        password: 'fox20000',
    });
    emanueleEmail = 'leleplx@gmail.com';
	
	var alexId = Accounts.createUser({
        email: 'alessandra.rigotti@gmail.com',
        password: 'fox20000',
    });
    alexEmail = 'alessandra.rigotti@gmail.com';
    
    var pippoId = Accounts.createUser({
        email: 'pippo@gmail.com',
        password: 'fox20000',
    });
	pippoEmail = 'pippo@gmail.com';
	
	// create lists and tasks
	tasks1 = [
		{
			name: "Van Gogh Museum",
			status: 2,
			removed: false,
			// owner: emanueleId,
			assignees: [],
			// stakeholders: [],
			stakeholderEmails: [],
			created_ts: (new Date()).getTime(),
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: '',
			alertdate_ts: null,
			comments: ''
		}, 
		{
			name: "Coffee Shop",
			status: 0,
			removed: false,
			// owner: emanueleId,
			assignees: [],
			// stakeholders: [],
			stakeholderEmails: [],
			created_ts: (new Date()).getTime(),
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: '',
			alertdate_ts: null,
			comments: ''
		},
		{
			name: "Mulin a Vent",
			status: 1,
			removed: false,
			// owner: emanueleId,
			assignees: [],
			// stakeholders: [],
			stakeholderEmails: [],
			created_ts: (new Date()).getTime(),
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: '',
			alertdate_ts: null,
			comments: ''
		}
	];
	
	var list1 = 
	{	
		name: "Visit Amsterdam",
		owner: emanueleId,
		// overallPriority: 0,
		assignees: [],
		// stakeholders: [emanueleId],
		stakeholderEmails: [emanueleEmail],
		removed: false,
		created_ts: (new Date()).getTime(),
	};
	
	list1Id = Lists.insert(list1);
	overallStatus = 0;
	for (var i = 0; i < tasks1.length; i++) {
		overallStatus = Math.max(tasks1[i].status, overallStatus);
		tasks1[i].owner = emanueleId;
		tasks1[i].list = list1Id;
		// tasks1[i].stakeholders.push(emanueleId);
		tasks1[i].stakeholderEmails.push(emanueleEmail);
		tasks1[i].rank = i;
		Tasks.insert(tasks1[i]);
	} // end for
	Lists.update(list1Id, {$set: {overallStatus: overallStatus}}, null);
	
	
	tasks2 = [
		{
			name: "Biscuits (not wheat flour)",
			status: 1,
			removed: false,
			// owner: emanueleId,
			assignees: [],
			// stakeholders: [],
			stakeholderEmails: [],
			created_ts: (new Date()).getTime(),
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: '',
			alertdate_ts: null,
			comments: ''
		}, 
		{
			name: "Pasta Multicolor",
			status: 3,
			removed: false,
			// owner: emanueleId,
			assignees: [],
			// stakeholders: [],
			stakeholderEmails: [],
			created_ts: (new Date()).getTime(),
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: '',
			alertdate_ts: null,
			comments: ''
		},
		{
			name: "Bread",
			status: 3,
			removed: false,
			// owner: emanueleId,
			assignees: [],
			// stakeholders: [],
			stakeholderEmails: [],
			created_ts: (new Date()).getTime(),
			duedate_ts: null,
			repeat_time_value: null,
			repeat_time_unit: null,
			email: false,
			notification: false,
			value_before: null,
			time_unit_before: '',
			alertdate_ts: null,
			comments: ''
		}
	];
	
	var list2 = 
	{	
		name: "Gluten Free Food",
		owner: alexId,
		// overallPriority: 0,
		assignees: [],
		// stakeholders: [alexId],
		stakeholderEmails: [alexEmail, emanueleEmail],
		removed: false,
		created_ts: (new Date()).getTime()
	};
	
	list2Id = Lists.insert(list2);
	overallStatus = 0;
	for (var i = 0; i < tasks2.length; i++) {
		overallStatus = Math.max(tasks2[i].status, overallStatus);
		tasks2[i].owner = alexId;
		tasks2[i].list = list2Id;
		// tasks2[i].stakeholders.push(alexId);
		tasks2[i].stakeholderEmails.push(alexEmail);
		tasks2[i].stakeholderEmails.push(emanueleEmail);
		tasks2[i].rank = i;
		tasks2[i]._id = Tasks.insert(tasks2[i]);
	} // end for
	
	Lists.update(list2Id, {$set: {overallStatus: overallStatus}}, null);
// 	Lists.update(list2Id, {$push: {assignees: emanueleId, 
// 									stakeholders: emanueleId, 
// 									stakeholderEmails: emanueleEmail,}}, null);
	
// 	Tasks.update(tasks2[0]._id, {$push: {assignees: pippoId,
// 											stakeholders: pippoId,
// 											stakeholderEmails: pippoEmail}}, null);
	
	Lists.update(tasks2[0].list, {$push: {stakeholders: pippoId,
											stakeholderEmails: pippoEmail}}, null);
	// When a user is marked as a stakeholder for the list, all the task in the list
	// must have the user as stakeholder
	for (var i = 0; i < tasks2.length; i++) {
		Tasks.update(tasks2[i]._id, {$push: {stakeholders: pippoEmail,
											stakeholderEmails: pippoEmail}}, null);
	}
	
	
	// Time to notify
	var eNot1 = {
		from: alexEmail,
		to: emanueleEmail,
		listId: list2Id,
		taskId: null,
		subject: 'Join My List: Gluten Free Food',
		object: 'Hi there, alessandra@gmail.com shared this list with you. Come and join us! The Bear In Mind team.',
		created_ts: (new Date()).getTime(),
		fire_ts: (new Date()).getTime() + 60*1000,
		fired_ts: null
	}
	var eNot1Id = EmailNotificationsQueue.insert(eNot1);
	
	var pNot1 = {
		from: alexEmail,
		to: emanueleEmail,
		listId: list2Id,
		taskId: null,
		text: 'alessandra.rigotti@gmail.com shared a list with you',
		created_ts: (new Date()).getTime(),
		fire_ts: null,
		fired_ts: null
	}
	var pNot1Id = PopupNotifications.insert(pNot1);
	
  } // end if
});
*/