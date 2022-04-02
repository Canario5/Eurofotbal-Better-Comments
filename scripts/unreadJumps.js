import { miniScroll } from "/scripts/miniScroll.js"
import { blinkingBg } from "/scripts/blinkingBg.js"

export { unreadJump }

const unreadJump = (jumpDirection, currentPos, unreadPositions) => {
	const lastUnreadPos = unreadPositions[unreadPositions.length - 1]

	switch (true) {
		case currentPos === "" && unreadPositions && unreadPositions.length > 0:
			return miniScroll(unreadPositions[0])

		case currentPos === "":
			miniScroll(0)
			return blinkingBg()

		case !jumpDirection && currentPos > unreadPositions[0] && currentPos < lastUnreadPos:
			return jumpScroll(jumpDirection, currentPos, unreadPositions)

		case !jumpDirection && currentPos > lastUnreadPos:
			return miniScroll(lastUnreadPos)

		case !jumpDirection && currentPos === lastUnreadPos && unreadPositions.length >= 2:
			return miniScroll(unreadPositions[unreadPositions.length - 2])

		case jumpDirection && currentPos < lastUnreadPos && unreadPositions.length > 0:
			return jumpScroll(jumpDirection, currentPos, unreadPositions)
	}

	blinkingBg()
}

const jumpScroll = (jumpDirection, currentPos, unreadPositions) => {
	for (let i = 0; i < unreadPositions.length; i++) {
		if (!(unreadPositions[i] > currentPos)) continue

		if (jumpDirection === true) return miniScroll(unreadPositions[i])

		if (jumpDirection === false && currentPos === unreadPositions[i - 1])
			return miniScroll(unreadPositions[i - 2])

		if (jumpDirection === false) return miniScroll(unreadPositions[i - 1])
	}
}
