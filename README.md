# Science Explainer

A browser based writing exercise for explaining science with a limited vocabulary. It combines a list of common English words with a selectable science list and a cutoff that limits the number of science entries allowed.

Open **About Science Explainer** for the teaching purpose, instructions, suggested activities, word list limitations, and credits. The dialog opens on request, supports Escape and a Close button, and returns keyboard focus to its launcher without changing the explanation.

Serve this directory with any static web server. No build, account, or backend is required. The word lists are local JSON files. New custom lists must currently be added to the app files and the selector in `app.js`; there is no upload control.

The default science list is an approximate biology list initially generated with AI. Its ordering and cutoff do not represent a validated curriculum or grade level. Highlighting checks vocabulary rather than scientific accuracy.
