Template.tasks.rendered = function() {
	var maxRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {rank : -1}});
	var minRankTask = Tasks.findOne({list : Session.get("listId")}, {sort: {rank : 0}});
	if (maxRankTask != undefined && minRankTask != undefined) {
		Session.set('maxRankTask', maxRankTask.rank);
		Session.set('minRankTask', minRankTask.rank);
	}
};

Template.tasks.helpers({
	tasks: function() {
		return Tasks.find({list: this._id}, {sort: {"rank" : -1}});
	}
});