
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

function getParam(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function scoreLoaded(xml) {
	//console.log("loaded",arguments);
	var root = $('#root');

    source = new ScoreLibrary.Score.Source(xml);

	credits = source.getCreditInfos();

	credits = _.map(credits, function(credit) {
		return credit.credits[0].text;
	});

	$('<div/>').text(credits.join(' - ')).css({
		fontSize: "24px",
		fontWeight: "bold",
		textAlign: "center",
		width: 500 + "px",
		padding: "15px 50px"
	}).appendTo(root);

    parts = source.getParts();
    var part = parts[0];
    if (part) {
    	App.score = new BoneScore(App.boneNotes, part);
    	App.renderer = new BoneRenderer({
    		vertical: false,
			slideGridDim: 80,
			slideGridSpacing: 1,
			timeGridDim: 50,
			timeGridSpacing: 1,
    		score: App.score,
    		parent: root
    	});
    	App.renderer.render();
    }
}

function scoreLoadError() {
	console.log("error",arguments);
}

$(document).ready(function() {
	//var file = "scores/backatown.xml";
	//var file = "scores/wenceslas.xml";
	var file = getParam("score") || "scores/josn.xml";

    ScoreLibrary.MusicXMLLoader.create(
        file,
        null,
        scoreLoaded,
        scoreLoadError);
});
