# ATM App

How to design an ATM Machine that allows a user to:
- deposit
- withdraw cash
- check balance?

How will you design such a system and what will be the main challenges?

## The main challenges will be:
1. Security - Number of attempts before the card is locked out.
2. Connectivity - No connection to the bank’s mainframe
3. Human Error - No receipts,  no cash or machine is turned off.
4. Not enough balance - cannot withdraw balance within the minimum.

## A very simple automated teller machine implementation with front-end and back-end test suite. Only accepts the PINS 1111, 2222, 3333, and 4444. Supports deposits and withdrawals. The tech stack is AngularJS, Node, Express, and a SQLite database. The test suite uses Karma, PhantomJS, Mocha, Chai, Sinon, and Istanbul.

## Installation

- Clone the repo, cd into the root directory in your terminal and run "npm install" to load all dependencies. Then run "npm start" to start the server. 
- Navigate to localhost:4000 in your browser. 
- Enter one of the abovementioned PINS and click the "Submit PIN" button to see the balance associated with that PIN from the database. 
- Upon entering amounts to deposit or withdraw and clicking the appropriate button, the balance change in the browser view will be reflected in the database. 
- This can be verified by running "sqlite3 ATM.db" in the terminal followed by "select * from pins;". 
- Exit SQLite3 with the command ".quit".

## Testing

To run the test suite, exit the server and run "npm test". In addition to the test results in the terminal, you will notice in the repo's root directory a new folder named "coverage". If you open the html files contained therein you will see the Karma-coverage and Istanbul reports for code coverage.

## Dummy Pins: (for testing purpose only)

- 1111
- 2222
- 3333
- 4444