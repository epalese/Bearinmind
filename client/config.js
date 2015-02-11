Accounts.ui.config({
	passwordSignupFields: 'EMAIL_ONLY'
});

$.fn.datepicker.defaults.format = "dd/mm/yyyy";
$.fn.datepicker.defaults.todayBtn = "linked";
$.fn.datepicker.defaults.clearBtn = true;
$.fn.datepicker.defaults.autoclose = true;
$.fn.datepicker.defaults.orientation = "right-middle";

Handlebars.registerHelper('section', function (input) {
	var section = Session.get('section');
	if (section == input)
		return true;
	else
		return false;
});