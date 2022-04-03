import { initComments } from "/scripts/initComments.js"
import { posChange } from "/scripts/posChange.js"
import { unreadJump } from "/scripts/unreadJumps.js"
import { parentJump, backToChild } from "/scripts/parentChildJump.js"
import { currentPosition } from "/scripts/currentPosition.js"

const mainScript = () => {
	let currentPos
	const { commentsTotal } = initComments()
	const nextUnread = true
	const previousUnread = false

	const dict = new Map([
		["KeyQ", () => posChange(-1, currentPos)], //* "UP +1" comment
		["KeyA", () => posChange(1, currentPos)], //* "DOWN +1" comment
		["KeyW", () => posChange(-5, currentPos)], //* "UP +5" comments
		["KeyS", () => posChange(5, currentPos)], //* "DOWN +5" comments
		["KeyE", () => unreadJump(previousUnread, currentPos)], //* "previous unread" comment
		["KeyD", () => unreadJump(nextUnread, currentPos)], //* "next unread" comment
		["KeyR", () => parentJump(currentPos)], //* R letter
		["KeyF", () => backToChild(currentPos)], //* F letter
		["Digit2", () => elementScroll(".article")], //* nr2 letter; scroll at the start of the article
		["KeyX", () => elementScroll(".content.newpost")], //* to the comment box, only logged in users */
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

mainScript()
