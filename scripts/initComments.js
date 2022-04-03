export { initComments }

const initComments = () => {
	if (initComments.value && Object.keys(initComments.value).length > 0)
		return initComments.value

	const allComments = document.querySelectorAll(".post")
	const commentsTotal = allComments.length

	// prettier-ignore
	const unreadPositions = [...allComments]
		.map((comment, i) => {if (comment.className.includes("unread")) return i})
		.filter((comment) => typeof comment === "number")

	const lastUnreadPos = unreadPositions[unreadPositions.length - 1]

	initComments.value = { allComments, commentsTotal, unreadPositions, lastUnreadPos }

	return initComments.value
}
