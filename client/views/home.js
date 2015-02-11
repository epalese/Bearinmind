Template.home.rendered = function() {
};

Template.home.events({
	'click #go-to-lists-btn': function(event) {
		event.preventDefault();
 		Router.go('lists');
	}
});