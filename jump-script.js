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

	initComments.value = [allComments, commentsTotal, unreadComments, lastUnread]
	currentPosition()
}

const currentPosition = (rewrite) => {
	if ((rewrite || rewrite === 0) && typeof rewrite === "number")
		return (currentPosition.value = rewrite)

	if (!currentPosition.value && currentPosition.value !== 0) {
		currentPosition.value = ""
	}
	return currentPosition.value
}

const jumpScroll = (nextUnread) => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	for (let i = 0; i < unreadComments.length; i++) {
		if (!(unreadComments[i] > currentPos)) continue

		if (nextUnread === true) return miniScroll(unreadComments[i])

		if (nextUnread === false && currentPos === unreadComments[i - 1])
			return miniScroll(unreadComments[i - 2])

		if (nextUnread === false) return miniScroll(unreadComments[i - 1])
	}
}

const miniScroll = (position, blinking) => {
	if (position || position === 0) {
		currentPosition(position)
	}
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	if (blinking) blinkingBg()

	console.log(`CurrentPosition is ${currentPos}`)
	allComments[currentPos].scrollIntoView({ behavior: "smooth" })
}

const posChange = (jumpSize) => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	if (currentPos === "") return miniScroll(0)

	// Negative jumpSize; Previous, climbing to the top -> comments
	if (jumpSize < 0 && currentPos < Math.abs(jumpSize)) return miniScroll(0, true)

	if (jumpSize < 0 && currentPos > 0) return miniScroll((currentPos += jumpSize))

	// Positive jumpSize; Next, sliding to the bottom -> comments
	if (jumpSize > 0 && currentPos > commentsTotal - (1 + jumpSize))
		return miniScroll(commentsTotal - 1, true)

	if (jumpSize > 0 && currentPos < commentsTotal - 1)
		return miniScroll((currentPos += jumpSize))
}

const unreadPrev = () => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	switch (true) {
		case currentPos === "" && unreadComments && unreadComments.length > 0:
			/* return miniScroll(lastUnread) */
			return miniScroll(unreadComments[0])

		case currentPos === "":
			return miniScroll(0, true)

		case currentPos > unreadComments[0] && currentPos < lastUnread:
			return jumpScroll(false)

		case currentPos > lastUnread:
			return miniScroll(lastUnread)

		case currentPos === lastUnread && unreadComments.length >= 2:
			return miniScroll(unreadComments[unreadComments.length - 2])
	}

	blinkingBg()
}

const unreadNext = () => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	switch (true) {
		case currentPos === "" && unreadComments && unreadComments.length > 0:
			return miniScroll(unreadComments[0])

		case currentPos === "":
			return miniScroll(0, true)

		case currentPos < lastUnread && unreadComments.length > 0:
			return jumpScroll(true)
	}

	blinkingBg()
}

const elementScroll = (targetPos) => {
	const elementTarget = document.querySelector(targetPos)
	elementTarget.scrollIntoView({ behavior: "smooth" })
}

const blinkingBg = () => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	const oldPos = allComments[currentPos]
	oldPos.onanimationend = () => {
		oldPos.classList.remove("BlinkBlink")
	}
	allComments[currentPos].classList.add("BlinkBlink")
}

const parentJump = () => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()
	let currentPos = currentPosition()

	if (!allComments[currentPos] || !allComments[currentPos].querySelector(".parentlink")) {
		return
	}

	let parentId = allComments[currentPos]
		.querySelector(".parentlink > [onclick]")
		.getAttribute("onclick")

	parentId = parentId.replace(/(\D+)/g, "") // Remove everything except numbers
	/* elementScroll(document.getElementById(`p${parentId}`)) */
	document.getElementById(`p${parentId}`).scrollIntoView({ behavior: "smooth" })
}

const dict = new Map([
	["KeyQ", () => posChange(-1)], //* Q letter "UP +1" comment
	["KeyA", () => posChange(1)], //* A letter "DOWN +1" comment
	["KeyW", () => posChange(-5)], //* W letter "UP +5" comments
	["KeyS", () => posChange(5)], //* S letter "DOWN +5" comments
	["KeyE", () => unreadPrev()], //* E letter "previous unread" comment
	["KeyD", () => unreadNext()], //* D letter "next unread" comment
	["KeyR", () => parentJump()], //* R letter
	["KeyF", () => elementScroll(".content.newpost")], //* F letter
	["Digit2", () => elementScroll(".article")], //* 2 letter scroll at the start of the article
	["KeyX", () => elementScroll(".content.newpost")], //* F letter to the comment box */
	["KeyP", () => "test"], //* test button
])

document.addEventListener("keyup", (e) => {
	const [allComments, commentsTotal, unreadComments, lastUnread] = initComments()

	if (!commentsTotal) return

	if (
		document.activeElement.tagName === "TEXTAREA" ||
		document.activeElement.tagName === "INPUT"
	)
		return // Key scripts doesnt run when typing text in text fields

	for (const [key, value] of dict) {
		if (e.code === key) {
			return value()
		}
	}
})

initComments()
