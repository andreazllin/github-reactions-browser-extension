import {EXTENSION_CONTAINER_ID} from "../constants/id"

// TODO: Fix styles to fit github's styles
export const Container = () => {
	const container = document.createElement("div")

	container.id = EXTENSION_CONTAINER_ID
	container.style.marginTop = "16px"
	container.style.padding = "8px"
	container.style.borderTop = "1px solid #FA7F80"
	container.style.display = "flex"
	container.style.flexDirection = "column"
	container.style.gap = "8px"

	return container
}
