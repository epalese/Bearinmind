Router.configure({ 
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return [];}
});

Router.onBeforeAction('loading');

Router.map(
	function() { 
		this.route('home', { 
			path: '/',
			data: function() {
				Session.set('section', 'home');
				}
			}
		);
		
		this.route('lists', {
			path: '/lists/',
			data: function() {
					Session.set('section', 'lists');
				}
			}
		);		
		this.route('list', {
			path: '/list/id/:_id',
			data: function() { 	Session.set('section', 'tasks');
								Session.set('listId', this.params._id);
								return {
									list: Lists.findOne({ _id: this.params._id}),
									tasks: Tasks.find({list: this.params._id})
								} 
			}
		});
		
		
		this.route('listsStatus', {
			path: '/lists/status/',
			data: function() {
					Session.set('section', 'listsStatus');
				}
			}
		);
		this.route('listStatus', {
			path: '/list/status/:status',
			data: function() { 	Session.set('section', 'tasksStatus');
								Session.set('status', this.params.status);
								return {
									tasks: Tasks.find({status: parseInt(this.params.status)}),
									overallStatus: this.params.status
								} 
			}
		});
		
		
		this.route('listsDate', {
			path: '/lists/date/',
			data: function() {
					Session.set('section', 'listsDate');
				}
			}
		);
		
		
		this.route('listDate', {
			path: '/list/date/:startdate/:enddate?',
			data: function() { 	
				Session.set('section', 'tasksDate');
				
				if (this.params.startdate == 'noduedate' && this.params.enddate == null) {
					return {
						tasks: Tasks.find(
							{duedate_ts: null}
						),
						startDate: this.params.startdate,
						endDate: null
					}
				}
				
				
				var startDate = parseDate(this.params.startdate).getTime();
				
				var endDate = null;
				if (this.params.enddate) {
					endDate = parseDate(this.params.enddate).getTime();
					// console.log('router: ' + startDate);
					return {
						tasks: Tasks.find(
							{duedate_ts: {'$gte': startDate, '$lte': endDate}}
						),
						startDate: startDate,
						endDate: endDate
					}
				}
				else {
					return {
						tasks: Tasks.find(
							{duedate_ts: {'$gte': startDate}}
						),
						startDate: startDate,
						endDate: null
					}
				}

				
			}
		});

	}
);

function parseDate(str) {
    if(!/^(\d){8}$/.test(str)) return null;
    var y = str.substr(0,4),
        m = str.substr(4,2) - 1,
        d = str.substr(6,2);
    return new Date(y,m,d);
}