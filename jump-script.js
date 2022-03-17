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

for (let i = 0; i < commentsTotal; i++)
	if (allComments[i].className.includes("unread")) {
		unreadComments.push(i)
	}
const lastUnread = unreadComments[unreadComments.length - 1]

const jumpScroll = (nextUnread) => {
	for (let i = 0; i < unreadComments.length; i++) {
		if (!(unreadComments[i] > currentPosition)) continue

		if (nextUnread === true) return elementScroll(unreadComments[i])

		if (nextUnread === false) {
			if (currentPosition === unreadComments[i - 1]) {
				return elementScroll(unreadComments[i - 2])
			}

			return elementScroll(unreadComments[i - 1])
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
	// prettier-ignore
	if (jumpSize > 0 && currentPosition > commentsTotal - (1 + jumpSize)) return miniScroll(commentsTotal - 1, true)
	// prettier-ignore
	if (jumpSize > 0 && currentPosition < commentsTotal - 1) return miniScroll((currentPosition += jumpSize))
}

const unreadPrev = () => {
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
	blinkingBg()
}

const unreadNext = () => {
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
	blinkingBg()
}

const elementScroll = (selectorDummy) => {
	let elementTarget
	if (Number.isInteger(selectorDummy)) {
		console.log("cislovani")
		elementTarget = document.querySelector(allComments[selectorDummy])
	}
	if (selectorDummy instanceof Element) {
		console.log("nodovani")
		elementTarget = selectorDummy
	}

	console.log(`CurrentPosition is ${currentPosition}`)
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
	elementScroll(document.getElementById(`p${parentId}`))
	/* document.getElementById(`p${parentId}`).scrollIntoView({ behavior: "smooth" }) */
}

const dict = new Map()
dict.set("KeyQ", () => posChange(-1)) //* Q letter "UP +1" comment
dict.set("KeyA", () => posChange(1)) //* A letter "DOWN +1" comment
dict.set("KeyW", () => posChange(-5)) //* W letter "UP +5" comments
dict.set("KeyS", () => posChange(5)) //* S letter "DOWN +5" comments
dict.set("KeyE", () => unreadPrev()) //* E letter "previous unread" comment
dict.set("KeyD", () => unreadNext()) //* D letter "next unread" comment
dict.set("KeyR", () => parentJump()) //* R letter
dict.set("KeyF", () => elementScroll(".content.newpost")) //* F letter
dict.set("Digit2", () => elementScroll(".article")) //* 2 letter scroll at the start of the article
dict.set("KeyX", () => elementScroll(".content.newpost")) //* F letter to the comment box

document.addEventListener("keyup", (e) => {
	if (!commentsTotal) return

	for (const [key, value] of dict) {
		if (e.code === key) {
			return value()
			/* dict.get("KeyS")() */
		}
	}
})
