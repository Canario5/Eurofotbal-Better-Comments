import { initComments } from "/scripts/initComments.js"
import { currentPosition } from "/scripts/currentPosition.js"

export { miniScroll }

const miniScroll = (position) => {
	if (position || position === 0) {
		currentPosition(position)
	} else return

	const { allComments } = initComments()

	/* console.log(`CurrentPosition is ${position}`) */
	allComments[position].scrollIntoView({ behavior: "smooth" })
}
