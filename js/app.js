
goog.provide('bonescore.app');

goog.require('ScoreLibrary');
goog.require('ScoreLibrary.MusicXMLLoader');
goog.require('ScoreLibrary.Score.Source');
goog.require('ScoreLibrary.Score.ElementIterFactory');

App = {
	boneNotes: new BoneNotes(),
	score: null,
	renderer: null
}

App.context = {
	scoreName: ko.observable(null),
	source: ko.observable(null),
	vertical: ko.observable(false),
	transpose: ko.observable(0),
}

function contextChanged() {
	if (App.context.source()) {
	    parts = App.context.source().getParts();
	    var part = parts[0];
	    if (part) {
	    	if (App.renderer) {
	    		App.renderer.clear();
	    		App.renderer = null;
	    	}
	    	if (App.score) {
	    		App.score = null;
	    	}

			var credits = App.context.source().getCreditInfos();
			credits = _.map(credits, function(credit) {
				return credit.credits[0].text;
			});
			App.credits.text(credits.join(' - '));

	    	App.score = new BoneScore(App.boneNotes, part, parseInt(App.context.transpose()));
	    	App.renderer = new BoneRenderer({
	    		vertical: App.context.vertical(),
				slideGridDim: 80,
				slideGridSpacing: 1,
				timeGridDim: 50,
				timeGridSpacing: 1,
	    		score: App.score,
	    		parent: App.root
	    	});
	    	App.renderer.render();
	    }
	}
}

function scoreNameChanged() {
    ScoreLibrary.MusicXMLLoader.create(
        App.context.scoreName(),
        null,
        scoreLoaded,
        scoreLoadError);
}

App.context.transpose.subscribe(contextChanged);
App.context.vertical.subscribe(contextChanged);
App.context.source.subscribe(contextChanged);
App.context.scoreName.subscribe(scoreNameChanged);

function getParam(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function scoreLoaded(xml) {
	//console.log("loaded",arguments);

    App.context.source(new ScoreLibrary.Score.Source(xml));
}

function scoreLoadError() {
	console.log("error",arguments);
}

$(document).ready(function() {
	//var file = "scores/backatown.xml";
	//var file = "scores/wenceslas.xml";
	App.root = $('#root');

	App.credits = $('<div/>').css({
		fontSize: "24px",
		fontWeight: "bold",
		textAlign: "center",
		width: 500 + "px",
		padding: "15px 50px"
	}).appendTo(App.root);

	var contextDiv = $('<div/>');
	contextDiv.attr('data-bind', "template: { name: 'contextTemplate', data: $data }").appendTo($('#context'));
	ko.applyBindings(App.context, contextDiv[0]);

	App.context.scoreName(getParam("score") || "scores/backatown.xml");
});
