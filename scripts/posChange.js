import { miniScroll } from "/scripts/miniScroll.js"
import { blinkingBg } from "/scripts/blinkingBg.js"

export { posChange }

const posChange = (jumpSize, currentPos, commentsTotal) => {
	if (currentPos === "") return miniScroll(0)

	// Negative jumpSize; Previous, climbing to the top -> comments
	if (jumpSize < 0 && currentPos < Math.abs(jumpSize)) {
		miniScroll(0)
		return blinkingBg()
	}

	// prettier-ignore
	if (jumpSize < 0 && currentPos > 0) 
        return miniScroll(currentPos + jumpSize)

	// Positive jumpSize; Next, sliding to the bottom -> comments
	if (jumpSize > 0 && currentPos > commentsTotal - (1 + jumpSize)) {
		miniScroll(commentsTotal - 1)
		return blinkingBg()
	}

	if (jumpSize > 0 && currentPos < commentsTotal - 1)
		return miniScroll(currentPos + jumpSize)
}
