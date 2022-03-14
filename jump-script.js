//*CSS file loading
const linkCSS = document.createElement("link")
linkCSS.type = "text/css"
linkCSS.href = chrome.runtime.getURL("JumpComments.css")
linkCSS.rel = "stylesheet"
document.head.append(linkCSS)

//*Hotkeys logic section
const allComments = document.querySelectorAll(".post")
const commentsTotal = allComments.length
const unreadComments = []
let currentPosition = ""
//let unreadPrev = ""
//let unreadNext = ""

for (let i = 0; i < commentsTotal; i++)
	if (allComments[i].className.includes("unread")) {
		unreadComments.push(i)
	}
const lastUnread = unreadComments[unreadComments.length - 1]

const jumpScroll = (nextUnread) => {
	for (let i = 0; i < unreadComments.length; i++) {
		if (!(unreadComments[i] > currentPosition)) continue

		if (nextUnread === true) {
			return miniScroll(unreadComments[i])
		}

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
	if (currentPosition === "") {
		return miniScroll(0)
	}
	// Negative jumpSize; Down -> comments
	if (jumpSize < 0 && currentPosition < Math.abs(jumpSize)) {
		return miniScroll(0, true)
	}

	if (jumpSize < 0 && currentPosition > 0) {
		return miniScroll((currentPosition += jumpSize))
	}

	// Positive jumpSize; Up -> comments
	if (jumpSize > 0 && currentPosition > commentsTotal - (1 + jumpSize)) {
		return miniScroll(commentsTotal - 1, true)
	}

	if (jumpSize > 0 && currentPosition < commentsTotal - 1) {
		return miniScroll((currentPosition += jumpSize))
	}
}

const elementScroll = (selectorDummy) => {
	const elementTarget = document.querySelector(selectorDummy)
	elementTarget.scrollIntoView({ behavior: "smooth" })
}

const blinkingBg = () => {
	const oldPos = allComments[currentPosition]
	oldPos.onanimationend = () => {
		oldPos.classList.remove("BlinkBlink")
	}
	allComments[currentPosition].classList.add("BlinkBlink")
}

document.addEventListener("keyup", (e) => {
	if (!commentsTotal) {
		return
	}
	if (e.code === "KeyQ") {
		//* Q letter "UP +1" comment
		return posChange(-1)
	}
	if (e.code === "KeyA") {
		//* A letter "DOWN +1" comment
		return posChange(1)
	}
	if (e.code === "KeyW") {
		//* W letter "UP +5" comments
		return posChange(-5)
	}
	if (e.code === "KeyS") {
		//* S letter "DOWN +5" comments
		return posChange(5)
	}
	if (e.code === "KeyE") {
		//* E letter "previous unread" comment
		if (currentPosition === "") {
			if (unreadComments.length) {
				return miniScroll(lastUnread)
			}
			return miniScroll(0, true)
		}
		if (currentPosition > unreadComments[0] && currentPosition < lastUnread) {
			return jumpScroll(false)
		}
		if (currentPosition > lastUnread) {
			return miniScroll(lastUnread)
		}
		if (currentPosition === lastUnread && unreadComments.length >= 2) {
			return miniScroll(unreadComments[unreadComments.length - 2])
		}
		return blinkingBg()
	}
	if (e.code === "KeyD") {
		//* D letter "next unread" comment
		if (currentPosition === "") {
			if (unreadComments.length) {
				return miniScroll(unreadComments[0])
			}
			return miniScroll(0, true)
		}
		if (currentPosition < lastUnread && unreadComments.length) {
			return jumpScroll(true)
		}
		return blinkingBg()
	}
	if (e.code === "KeyR") {
		//* R letter scroll at the start of the article
		return elementScroll(".article")
	}
	if (e.code === "KeyF") {
		//* F letter to the comment box
		return elementScroll(".content.newpost")
	}
})
