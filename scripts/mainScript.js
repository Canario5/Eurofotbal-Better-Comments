import { unreadJump } from "/scripts/unreadJumps.js"
import { posChange } from "/scripts/posChange.js"
import { parentJump, backToChild } from "/scripts/parentChildJump.js"
import { currentPosition } from "/scripts/currentPosition.js"

export { initComments }

const initComments = () => {
	if (initComments.value && initComments.value.length > 0) return initComments.value

	let currentPos
	const allComments = document.querySelectorAll(".post")
	const commentsTotal = allComments.length

	const unreadPositions = []
	for (let i = 0; i < commentsTotal; i++)
		if (allComments[i].className.includes("unread")) {
			unreadPositions.push(i)
		}

	initComments.value = allComments

	const nextUnread = true
	const previousUnread = false
	const dict = new Map([
		["KeyQ", () => posChange(-1, currentPos, commentsTotal)], //* "UP +1" comment
		["KeyA", () => posChange(1, currentPos, commentsTotal)], //* "DOWN +1" comment
		["KeyW", () => posChange(-5, currentPos, commentsTotal)], //* "UP +5" comments
		["KeyS", () => posChange(5, currentPos, commentsTotal)], //* "DOWN +5" comments
		["KeyE", () => unreadJump(previousUnread, currentPos, unreadPositions)], //* "previous unread" comment
		["KeyD", () => unreadJump(nextUnread, currentPos, unreadPositions)], //* "next unread" comment
		["KeyR", () => parentJump(currentPos, allComments)], //* R letter
		["KeyF", () => backToChild(currentPos)], //* F letter
		["Digit2", () => elementScroll(".article")], //* nr2 letter; scroll at the start of the article
		["KeyX", () => elementScroll(".content.newpost")], //* to the comment box */
		/* ["KeyP", () => console.log("test")], // test button */
	])

	document.addEventListener("keyup", (e) => {
		if (!commentsTotal) return

		// Key scripts doesnt run when typing text in text fields
		const elementTag = document.activeElement.tagName
		if (elementTag === "TEXTAREA" || elementTag === "INPUT") return

		currentPos = currentPosition()

		for (const [key, value] of dict) {
			if (e.code === key) {
				return value()
			}
		}
	})
}

const elementScroll = (targetPos) => {
	const elementTarget = document.querySelector(targetPos)
	if (!(elementTarget instanceof Element)) return // if not valid active node, return
	elementTarget.scrollIntoView({ behavior: "smooth" })
}

initComments()
