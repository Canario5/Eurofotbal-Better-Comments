import { initComments } from "/scripts/initComments.js"
import { miniScroll } from "/scripts/miniScroll.js"
import { blinkingBg } from "/scripts/blinkingBg.js"

export { posChange }

const posChange = (jumpSize, currentPos) => {
	const { commentsTotal } = initComments()

	switch (true) {
		case currentPos === "":
			return miniScroll(0)

		// Negative jumpSize; Previous, climbing to the top -> comments
		case jumpSize < 0 && currentPos < Math.abs(jumpSize):
			miniScroll(0)
			return blinkingBg()

		case jumpSize < 0 && currentPos > 0:
			return miniScroll(currentPos + jumpSize)

		// Positive jumpSize; Next, sliding to the bottom -> comments
		case jumpSize > 0 && currentPos > commentsTotal - (1 + jumpSize):
			miniScroll(commentsTotal - 1)
			return blinkingBg()

		case jumpSize > 0 && currentPos < commentsTotal - 1:
			return miniScroll(currentPos + jumpSize)
	}
}
