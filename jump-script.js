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
		if (unreadComments[i] > currentPosition) {
			if (nextUnread === true) {
				currentPosition = unreadComments[i]
			}

			if (nextUnread === false) {
				if (currentPosition === unreadComments[i - 1]) {
					currentPosition = unreadComments[i - 2]
				} else {
					currentPosition = unreadComments[i - 1]
				}
			}

			break
		}
	}
}

const miniScroll = () => {
	/* console.log(`CurrentPosition is ${currentPosition}`) */
	allComments[currentPosition].scrollIntoView({ behavior: "smooth" })
}

const bigScroll = (jumpSize) => {
	if (currentPosition === "") {
		currentPosition = 0
	}
	if (jumpSize < 0) {
		if (currentPosition < Math.abs(jumpSize)) {
			currentPosition = 0
			blinkingBg()
		} else if (currentPosition > 0) {
			currentPosition += jumpSize
		}
	}
	if (jumpSize > 0) {
		if (currentPosition > commentsTotal - (1 + jumpSize)) {
			currentPosition = commentsTotal - 1
			blinkingBg()
		} else if (currentPosition < commentsTotal - 1) {
			currentPosition += jumpSize
		}
	}
	miniScroll()
}

const elementScroll = (selectorDummy) => {
	const elementTarget = document.querySelector(selectorDummy)
	elementTarget.scrollIntoView({ behavior: "smooth" })
}

const blinkingBg = () => {
	allComments[currentPosition].addEventListener("animationend", () => {
		allComments[currentPosition].classList.remove("stopBlink")
	})
	allComments[currentPosition].classList.add("stopBlink")
}

document.addEventListener("keyup", (e) => {
	if (!commentsTotal) {
		return
	}
	if (e.code === "KeyQ") {
		//* Q letter "UP +1" comment
		bigScroll(-1)
	}
	if (e.code === "KeyA") {
		//* A letter "DOWN +1" comment
		bigScroll(1)
	}
	if (e.code === "KeyW") {
		//* W letter "UP +5" comments
		bigScroll(-5)
	}
	if (e.code === "KeyS") {
		//* S letter "DOWN +5" comments
		bigScroll(5)
	}
	if (e.code === "KeyE") {
		//* E letter "previous unread" comment
		if (currentPosition === "") {
			if (unreadComments.length) {
				currentPosition = lastUnread
			} else {
				currentPosition = 0
				blinkingBg()
			}
		} else if (currentPosition > unreadComments[0] && currentPosition < lastUnread) {
			jumpScroll(false)
		} else if (currentPosition > lastUnread) {
			currentPosition = lastUnread
		} else if (currentPosition === lastUnread && unreadComments.length >= 2) {
			currentPosition = unreadComments[unreadComments.length - 2]
		} else {
			blinkingBg()
		}
		miniScroll()
	}
	if (e.code === "KeyD") {
		//* D letter "next unread" comment
		if (currentPosition === "") {
			if (unreadComments.length) {
				currentPosition = unreadComments[0]
			} else {
				currentPosition = 0
				blinkingBg()
			}
		} else if (currentPosition < lastUnread && unreadComments.length) {
			jumpScroll(true)
		} else {
			blinkingBg()
		}
		miniScroll()
	}
	if (e.code === "KeyR") {
		//* R letter scroll at the start of the article
		elementScroll(".article")
	}
	if (e.code === "KeyF") {
		//* rovnou k psaní nového komentu
		elementScroll(".content.newpost")
	}
})
