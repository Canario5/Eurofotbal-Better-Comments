import { initComments } from "/scripts/initComments.js"
import { miniScroll } from "/scripts/miniScroll.js"
import { blinkingBg } from "/scripts/blinkingBg.js"

export { previousUnread, nextUnread }

const previousUnread = (currentPos) => {
	const { unreadPositions, lastUnreadPos } = initComments()

	if (currentPos === "" && startUnreadJump(unreadPositions) === true) return

	if (currentPos > unreadPositions[0] && currentPos <= lastUnreadPos) {
		for (let i = currentPos - 1; i >= 0; i--) {
			if (unreadPositions.indexOf(i) !== -1) return miniScroll(i)
		}
		return blinkingBg()
	}

	if (currentPos > lastUnreadPos) {
		return miniScroll(lastUnreadPos)
	}

	blinkingBg()
}

const nextUnread = (currentPos) => {
	const { unreadPositions, lastUnreadPos } = initComments()

	if (currentPos === "" && startUnreadJump(unreadPositions) === true) return

	if (currentPos < lastUnreadPos && unreadPositions.length > 0) {
		for (let i = currentPos + 1; i <= lastUnreadPos; i++) {
			if (unreadPositions.indexOf(i) !== -1) return miniScroll(i)
		}
		return blinkingBg()
	}

	blinkingBg()
}

const startUnreadJump = (unreadPositions) => {
	if (!unreadPositions) {
		miniScroll(0)
		blinkingBg()
		return true
	}

	miniScroll(unreadPositions[0])
	return true
}
