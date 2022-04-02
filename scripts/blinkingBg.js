import { initComments } from "/scripts/mainScript.js"
import { currentPosition } from "/scripts/currentPosition.js"

export { blinkingBg }

const blinkingBg = () => {
	const allComments = initComments()
	const currentPos = currentPosition()

	const oldPos = allComments[currentPos]
	oldPos.onanimationend = () => {
		oldPos.classList.remove("BlinkBlink")
	}
	allComments[currentPos].classList.add("BlinkBlink")
}
