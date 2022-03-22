//*CSS file loading
;(() => {
	const linkCSS = document.createElement("link")
	linkCSS.type = "text/css"
	linkCSS.href = chrome.runtime.getURL("JumpComments.css")
	linkCSS.rel = "stylesheet"
	document.head.append(linkCSS)
})()

//*Hotkeys logic section

const initComments = () => {
	if (initComments.value && initComments.value.length > 0) return initComments.value

	const allComments = document.querySelectorAll(".post")
	const commentsTotal = allComments.length
	const unreadComments = []
	for (let i = 0; i < commentsTotal; i++)
		if (allComments[i].className.includes("unread")) {
			unreadComments.push(i)
		}

	const lastUnread = unreadComments[unreadComments.length - 1]

	initComments.value = allComments
	let currentPos = currentPosition()

	//* Keys section
	const dict = new Map([
		["KeyQ", () => posChange(-1, commentsTotal)], //* Q letter "UP +1" comment
		["KeyA", () => posChange(1, commentsTotal)], //* A letter "DOWN +1" comment
		["KeyW", () => posChange(-5, commentsTotal)], //* W letter "UP +5" comments
		["KeyS", () => posChange(5, commentsTotal)], //* S letter "DOWN +5" comments
		["KeyE", () => unreadPrev(unreadComments, lastUnread)], //* E letter "previous unread" comment
		["KeyD", () => unreadNext(unreadComments, lastUnread)], //* D letter "next unread" comment
		["KeyR", () => parentJump(allComments)], //* R letter
		["KeyF", () => backToChild()], //* F letter
		["Digit2", () => elementScroll(".article")], //* 2 letter scroll at the start of the article
		["KeyX", () => elementScroll(".content.newpost")], //* F letter to the comment box */
		/* ["KeyP", () => console.log("test")], // test button */
	])

	document.addEventListener("keyup", (e) => {
		if (!commentsTotal) return

		// Key scripts doesnt run when typing text in text fields
		if (
			document.activeElement.tagName === "TEXTAREA" ||
			document.activeElement.tagName === "INPUT"
		) {
			return
		}

		for (const [key, value] of dict) {
			if (e.code === key) {
				return value()
			}
		}
	})
}

const currentPosition = (rewrite) => {
	if ((rewrite || rewrite === 0) && typeof rewrite === "number")
		return (currentPosition.value = rewrite)

	if (!currentPosition.value && currentPosition.value !== 0) {
		currentPosition.value = ""
	}
	return currentPosition.value
}

const miniScroll = (position, blinking) => {
	if (position || position === 0) {
		currentPosition(position)
	}
	const allComments = initComments()
	let currentPos = currentPosition()

	if (blinking) blinkingBg()

	console.log(`CurrentPosition is ${currentPos}`)
	allComments[currentPos].scrollIntoView({ behavior: "smooth" })
}

const blinkingBg = () => {
	const allComments = initComments()
	const currentPos = currentPosition()

	const oldPos = allComments[currentPos]
	oldPos.onanimationend = () => {
		oldPos.classList.remove("BlinkBlink")
	}
	allComments[currentPos].classList.add("BlinkBlink")
}

const posChange = (jumpSize, commentsTotal) => {
	let currentPos = currentPosition()
	if (currentPos === "") return miniScroll(0)

	// Negative jumpSize; Previous, climbing to the top -> comments
	if (jumpSize < 0 && currentPos < Math.abs(jumpSize)) return miniScroll(0, true)

	if (jumpSize < 0 && currentPos > 0) return miniScroll(currentPos + jumpSize)

	// Positive jumpSize; Next, sliding to the bottom -> comments
	if (jumpSize > 0 && currentPos > commentsTotal - (1 + jumpSize))
		return miniScroll(commentsTotal - 1, true)

	if (jumpSize > 0 && currentPos < commentsTotal - 1) return miniScroll(currentPos + jumpSize)
}

const unreadPrev = (unreadComments, lastUnread) => {
	let currentPos = currentPosition()
	switch (true) {
		case currentPos === "" && unreadComments && unreadComments.length > 0:
			/* return miniScroll(lastUnread) */
			return miniScroll(unreadComments[0])

		case currentPos === "":
			return miniScroll(0, true)

		case currentPos > unreadComments[0] && currentPos < lastUnread:
			return jumpScroll(false, currentPos, unreadComments)

		case currentPos > lastUnread:
			return miniScroll(lastUnread)

		case currentPos === lastUnread && unreadComments.length >= 2:
			return miniScroll(unreadComments[unreadComments.length - 2])
	}

	blinkingBg()
}

const unreadNext = (unreadComments, lastUnread) => {
	let currentPos = currentPosition()
	switch (true) {
		case currentPos === "" && unreadComments && unreadComments.length > 0:
			return miniScroll(unreadComments[0])

		case currentPos === "":
			return miniScroll(0, true)

		case currentPos < lastUnread && unreadComments.length > 0:
			return jumpScroll(true, currentPos, unreadComments)
	}

	blinkingBg()
}

const jumpScroll = (nextUnread, currentPos, unreadComments) => {
	for (let i = 0; i < unreadComments.length; i++) {
		if (!(unreadComments[i] > currentPos)) continue

		if (nextUnread === true) return miniScroll(unreadComments[i])

		if (nextUnread === false && currentPos === unreadComments[i - 1])
			return miniScroll(unreadComments[i - 2])

		if (nextUnread === false) return miniScroll(unreadComments[i - 1])
	}
}

const parentJump = (allComments) => {
	let currentPos = currentPosition()
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

const backToChild = (parentPos, childPos) => {
	let currentPos = currentPosition()
	if ((parentPos || parentPos === 0) && typeof parentPos === "number") {
		backToChild.parentPos = parentPos
		backToChild.childPos = childPos
		return
	}

	if (backToChild.parentPos === currentPos) return miniScroll(backToChild.childPos)
}

const elementScroll = (targetPos) => {
	const elementTarget = document.querySelector(targetPos)
	elementTarget.scrollIntoView({ behavior: "smooth" })
}

initComments()
