Bone-Score Trombone music notation
==================================

About
-----

bone-score is a web app that loads MusicXML (see http://www.makemusic.com/musicxml) format music score files (using score-library) and renders them in an experimental view that shows
slide positions and partials in place of musical score.

MusicXML can be exported from many music score editors like MuseScore, Finale, Finale Notepad and Sebelius.

Project Status
--------------

Very early stages, more features and refactoring coming. Planned:

- color coding partials [DONE]
- showing notes that are out of user's range
- select part from files with multiple parts
- transpose up/down (or transpose within trombone range for tunes that aren't within range) buttons [DONE]
- support horizontal or vertical rendering [DONE]
- render seperate canvases per measure OR rendering measure dividers OR breaking by measure at max-time-dimension
- show notes and timing as part of notation
- optimize score to trombone translation algorithm for minimal slide/partial changes
- allow user to select alternate positioning for notes that have multiple options

Installation with dependencies
------------------------------

Download bone-score:

    git clone git@github.com:sambaker/bone-score.git

Download Google Closure library (see https://developers.google.com/closure/library/docs/gettingstarted) as a sibling to the bone-score folder:

    svn checkout http://closure-library.googlecode.com/svn/trunk/ closure-library

Download score-library (see https://github.com/navigator117/score-library/) also as a sibling to the bone-score folder:

    git clone git://github.com/navigator117/score-library.git
