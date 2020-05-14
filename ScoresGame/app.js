/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game



MY NOTES. COPY THEM TO NOTEPAD SOMETIME.
document is an Object that gives us access to DOM object

Math.floor - rounds float value to a lowest nearest number. 4.6 will be rounded to 4
Math.round - returns random float from 0 to 1


*/

var playersScores, roundScore, activePlayer, dice;

playersScores = [0, 0];
roundScore = 0;
activePlayer = 0;

/**
 * The style property only exists on html elements. 
 * However a query selector like '.square' may return any type of element. 
 * VS Code cannot know that it will return a div or even that it will return an html element.
 * 
 * You can use a jsdoc type annotation to let VS Code know what 
 * this querySelector returns an HTMLElement:
 */

document.querySelector('.dice').style.display = 'none';
document.getElementById('score-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('current-1').textContent = '0';

// document.querySelector('#current-' + activePlayer).textContent = dice;

// to work with the HTML inside the selected block
// document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';

// change style of some block
//document.querySelector('.dice').style.display = 'none';

document.querySelector('.btn-roll').addEventListener('click', function(){
    var rolledDiceValue = Math.floor(Math.random() * 6) + 1;

    var diceElement = document.querySelector('.dice');

    // how to handle auto-completion for cases when after selecting element there are no HTMLElement 
    // specific methods in auto-completion. This is because querySelector method returns 
    // general object Element which lacks of some methods instead of more specific HTMLElement
    // that has desired style and etc methods 
    // https://stackoverflow.com/questions/46797322/vscode-intellisense-does-not-autocomplete-javascript-dom-events-and-methods
    diceElement.style.display = 'block';
    diceElement.src = 'dice-' + rolledDiceValue + '.png';

    if(rolledDiceValue > 1){
        document.getElementById('score-' + activePlayer).textContent = rolledDiceValue;
        playersScores[activePlayer] += rolledDiceValue;
        document.getElementById('current-' + activePlayer).textContent = playersScores[activePlayer];
    } else {
        diceElement.src = 'dice-' + rolledDiceValue + '.png';
        playersScores[activePlayer] = 0;
        document.getElementById('score-' + activePlayer).textContent = 0;
        document.getElementById('current-' + activePlayer).textContent = 0;
        activePlayer === 0 ? activePlayer = 1: activePlayer = 0;

        // one way to add or remove some class from Element are the following
        // document.getElementsByClassName('player-0-panel').classList.revome('active');
        // document.getElementsByClassName('player-0-panel').classList.add('active');
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        setTimeout(function() {
            diceElement.style.display = 'none'
        }, 3000);
        
    }
    

})