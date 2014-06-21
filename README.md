Rock Paper Scissors Bot
=======================


## How does it work?
The bot tries to predict your next move by looking at what was picked next in previous games that had the same user/bot pick combo as you did in the last games you played. If you haven't played any games yet, the bot will pick whatever beats the most commonly chosen first pick.


## JS file structure

 1. helpers.js
    - contains generic helper functions that are not specific to this app
    - all exports are properties of this file's only global: `$`
    - the first JS file loaded -no dependencies
 2. control.js
    - contains functions with functionality specific to this app
    - all exports are properties of this file's only global: `_`
    - can access all properties of `$`*
 3. app.js
    - initializes everything (generates necessary DOM, adds event listeners, etc.)
    - all exports are properties of this file's only global: `app`
    - can access all properties of `$` and `_`

\*control.js is loaded before app.js, but properties of `app` can be used in control.js functions if the functions are called only *after* the properties used are set.
