import { miniScroll } from "/scripts/miniScroll.js"

export { parentJump, backToChild }

const parentJump = (currentPos, allComments) => {
	if (!allComments[currentPos] || !allComments[currentPos].querySelector(".parentlink")) {
		return
	}

	let parentId = allComments[currentPos]
		.querySelector(".parentlink > [onclick]")
		.getAttribute("onclick")

	parentId = parentId.replace(/(\D+)/g, "") // Remove everything except numbers
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
	if ((currentPos || currentPos === 0) && typeof currentPos === "number" && childPos) {
		backToChild.parentPos = currentPos
		backToChild.childPos = childPos
		return
	}

	if (backToChild.parentPos === currentPos) return miniScroll(backToChild.childPos)
}
