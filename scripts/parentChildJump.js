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

	for (let i = 0; i < allComments.length; i++) {
		if (allComments[i].id === parentId) {
			const position = currentPos - (currentPos - i)
			backToChild(position, currentPos)
			return miniScroll(position)
		}
	}
}

const backToChild = (currentPos, childPos) => {
	if (childPos && typeof childPos === "number") {
		backToChild.parentPos = currentPos
		backToChild.childPos = childPos
		return
	}

	if (backToChild.parentPos === currentPos) return miniScroll(backToChild.childPos)
}
