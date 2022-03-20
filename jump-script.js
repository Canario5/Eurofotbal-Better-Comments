//*CSS file loading
const loadCSS = () => {
	const linkCSS = document.createElement("link")
	linkCSS.type = "text/css"
	linkCSS.href = chrome.runtime.getURL("JumpComments.css")
	linkCSS.rel = "stylesheet"
	document.head.append(linkCSS)
}

//*Hotkeys logic section

let currentPosition = ""

const initComments = () => {
	if (initComments.value && initComments.value.length > 0) return initComments.value

	const allComments = document.querySelectorAll(".post")
	const commentsTotal = allComments.length
	const unreadComments = []
	for (let i = 0; i < commentsTotal; i++)
		if (allComments[i].className.includes("unread")) {
			unreadComments.push(i)
		}

	initComments.value = [allComments, commentsTotal, unreadComments]

	/* lastUnread() */
}

const lastUnread = () => {
	if (!lastUnread.value) lastUnread.value = unreadComments[unreadComments.length - 1] || 0

	return lastUnread.value
}

const jumpScroll = (nextUnread) => {
	for (let i = 0; i < unreadComments.length; i++) {
		if (!(unreadComments[i] > currentPosition)) continue

		if (nextUnread === true) return miniScroll(unreadComments[i])

		if (nextUnread === false) {
			if (currentPosition === unreadComments[i - 1]) {
				return miniScroll(unreadComments[i - 2])
			}

			return miniScroll(unreadComments[i - 1])
		}
	}
}

const miniScroll = (position, blinking) => {
	if (position || position === 0) {
		currentPosition = position
	}

	if (blinking) blinkingBg()

	console.log(`CurrentPosition is ${currentPosition}`)
	allComments[currentPosition].scrollIntoView({ behavior: "smooth" })
}

const posChange = (jumpSize) => {
	if (currentPosition === "") return miniScroll(0)

	// Negative jumpSize; Previous, climbing to the top -> comments
	if (jumpSize < 0 && currentPosition < Math.abs(jumpSize)) return miniScroll(0, true)

	if (jumpSize < 0 && currentPosition > 0) return miniScroll((currentPosition += jumpSize))

	// Positive jumpSize; Next, sliding to the bottom -> comments
	if (jumpSize > 0 && currentPosition > commentsTotal - (1 + jumpSize))
		return miniScroll(commentsTotal - 1, true)

	if (jumpSize > 0 && currentPosition < commentsTotal - 1)
		return miniScroll((currentPosition += jumpSize))
}

const unreadPrev = () => {
	if (currentPosition === "") {
		if (unreadComments.length) {
			return miniScroll(lastUnread())
		}
		return miniScroll(0, true)
	}
	if (currentPosition > unreadComments[0] && currentPosition < lastUnread()) {
		return jumpScroll(false)
	}
	if (currentPosition > lastUnread()) {
		return miniScroll(lastUnread())
	}
	if (currentPosition === lastUnread() && unreadComments.length >= 2) {
		return miniScroll(unreadComments[unreadComments.length - 2])
	}
	blinkingBg()
}

const unreadNext = () => {
	if (currentPosition === "") {
		if (unreadComments.length) {
			return miniScroll(unreadComments[0])
		}
		return miniScroll(0, true)
	}
	if (currentPosition < lastUnread() && unreadComments.length) {
		return jumpScroll(true)
	}
	blinkingBg()
}

const elementScroll = (targetPos, blinking) => {
	const elementTarget = document.querySelector(targetPos)
	elementTarget.scrollIntoView({ behavior: "smooth" })
}

const blinkingBg = () => {
	const oldPos = allComments[currentPosition]
	oldPos.onanimationend = () => {
		oldPos.classList.remove("BlinkBlink")
	}
	allComments[currentPosition].classList.add("BlinkBlink")
}

const parentJump = () => {
	if (
		!allComments[currentPosition] ||
		!allComments[currentPosition].querySelector(".parentlink")
	) {
		return
	}

	let parentId = allComments[currentPosition]
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
	["KeyP", ""], //* test button
])

document.addEventListener("keyup", (e) => {
	if (!commentsTotal) return

	for (const [key, value] of dict) {
		if (e.code === key) {
			return value()
		}
	}
})

loadCSS()
initComments()
