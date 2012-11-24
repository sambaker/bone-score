Bone-Score Trombone music notation
==================================

About
-----

bone-score is a web app that loads MusicXML (see http://www.makemusic.com/musicxml) format music score files (using score-library) and renders them in an experimental view that shows
slide positions and partials in place of musical score.

MusicXML can be exported from many music score editors like MuseScore, Finale, Finale Notepad and Sebelius.

Project Status
--------------

Very early stages, more features and refactoring coming

Installation with dependencies
------------------------------

Download bone-score:

    git clone git@github.com:sambaker/bone-score.git

Download Google Closure library (see https://developers.google.com/closure/library/docs/gettingstarted) as a sibling to the bone-score folder:

    svn checkout http://closure-library.googlecode.com/svn/trunk/ closure-library

Download score-library (see https://github.com/navigator117/score-library/) also as a sibling to the bone-score folder:

    git clone git://github.com/navigator117/score-library.git
