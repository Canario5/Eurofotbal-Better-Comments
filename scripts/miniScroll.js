import { initComments } from "/scripts/mainScript.js"
import { currentPosition } from "/scripts/currentPosition.js"

export { miniScroll }

const miniScroll = (position) => {
	if (position || position === 0) {
		currentPosition(position)
	} else return
	const allComments = initComments()

	console.log(`CurrentPosition is ${position}`)
	allComments[position].scrollIntoView({ behavior: "smooth" })
}
