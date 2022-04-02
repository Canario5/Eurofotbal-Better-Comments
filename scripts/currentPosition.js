export { currentPosition }

const currentPosition = (rewrite) => {
	if (typeof rewrite === "number") return (currentPosition.value = rewrite)

	if (!currentPosition.value && currentPosition.value !== 0) {
		currentPosition.value = ""
	}

	return currentPosition.value
}
