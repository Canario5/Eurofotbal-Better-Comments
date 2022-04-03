import { initComments } from "/scripts/initComments.js"
import { miniScroll } from "/scripts/miniScroll.js"

export { parentJump, backToChild }

const parentJump = (currentPos) => {
	const { allComments } = initComments()
	if (!allComments[currentPos] || !allComments[currentPos].querySelector(".parentlink")) {
		return
	}

	let parentId = allComments[currentPos]
		.querySelector(".parentlink > [onclick]")
		.getAttribute("onclick")

	parentId = parentId.replace(/(\D+)/g, "") // Removing everything except numbers
	parentId = "p" + parentId

	const parentComment = [...allComments].find((comment, i) => {
		if (comment.id === parentId) {
			const position = currentPos - (currentPos - i)
			backToChild(position, currentPos)
			miniScroll(position)
			return true //! NOTE: for later
		}
	})
}

const backToChild = (currentPos, childPos) => {
	if (childPos && typeof childPos === "number") {
		backToChild.parentPos = currentPos
		backToChild.childPos = childPos
		return
	}

	if (backToChild.parentPos === currentPos) return miniScroll(backToChild.childPos)
}
