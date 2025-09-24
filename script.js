const hangmanImageEl = document.querySelector('#hangman-image')
const wordEl = document.querySelector('#word')
const guessTextEl = document.querySelector('#guess-text')
const guessSubmitEl = document.querySelector('#guess-submit')
const guessHistoryEl = document.querySelector('#guess-history')

const /** @type string[] */ words = ((await(await fetch("./words.txt")).text()).split(
	"\n",
))
let randomWord = ''
let hangmanImage = 1
let guessNumber = 0
let wrongGuessNumber = 0
let /** @type {string[]} */ pastWords = []
/**
 * Would prefer using sets here. However, the rubric specifies
 * that arrays must be used at least once. So I'll use them here.
 */
let /** @type {string[]} */ guesses = []


setupGame()
function setupGame() {
	guesses = []
	hangmanImage = 1
	hangmanImageEl.setAttribute('src', `./images/hangman-${hangmanImage}.png`)
	randomWord = ''
	while (randomWord.length < 3 && !pastWords.includes(randomWord)) {
		const randomNum = Math.floor(Math.random() * words.length)
		randomWord = words[randomNum]
	}
	wordEl.textContent = formatWord()
	document.querySelector('.final-game-status').style.display = 'none'
	guessHistoryEl.innerHTML = ''
	guessNumber = 0
	guessTextEl.value = ''
	console.info(randomWord)
}

document.querySelector('#play-again').addEventListener('click', setupGame)

guessSubmitEl.addEventListener('click', (/** @type {Event} */ ev) => {
	const guess = /** @type {HTMLInputElement} */ (guessTextEl).value
	if (!guess || guess.length === 0) {
		return;
	}
	guesses.push(guess)
	wordEl.textContent = formatWord()
	guessNumber += 1

	let correctStatus = ''
	if (!wordEl.textContent.includes('_') || randomWord === guess) {
		// Player won!
		document.querySelector('#game-status').style.color = 'cadetblue'
		document.querySelector('#game-status').innerText = 'YOU WON!'
		document.querySelector('.final-game-status').style.display = 'block'
		correctStatus = 'correct'
		pastWords.push(randomWord)
	} else if (randomWord.indexOf(guess) !== -1 && guess.length === 1) {
		// Player guess was correct.
		if (guesses.filter(g => g === guess).length > 1) {
			correctStatus = 'incorrect'
			hangmanImage += 1;
			wrongGuessNumber += 1
			hangmanImageEl.setAttribute('src', `./images/hangman-${hangmanImage}.png`)
		} else {
			correctStatus = 'correct'
		}
	} else {
		// Player guess was incorrect.
		correctStatus = 'incorrect'
		hangmanImage += 1;
		wrongGuessNumber += 1
		hangmanImageEl.setAttribute('src', `./images/hangman-${hangmanImage}.png`)

		if (wrongGuessNumber === 6) {
			document.querySelector('#game-status').style.color = 'crimson'
			document.querySelector('#game-status').innerText = 'YOU LOST!'
			document.querySelector('.final-game-status').style.display = 'block'
			pastWords.push(randomWord)
		}		
	}

	guessHistoryEl.innerHTML  = `<div><b class="guess-${correctStatus}">Guess ${guessNumber}:</b> ${guess}</div>` + guessHistoryEl.innerHTML;
})

function formatWord() {
	let text = ''
	for (const ch of randomWord) {
		if (guesses.includes(ch)) {
			text += ch + ' '
		} else {
			text += '_ '
		}
	}
	text = text.trimEnd()
	return text
}
