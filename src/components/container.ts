import {EXTENSION_CONTAINER_ID} from "../constants/id"

export const Container = () => {
	const container = document.createElement("div")

	container.id = EXTENSION_CONTAINER_ID
	container.style.cssText = `
		margin-top: 16px;
		padding: 12px;
		border-radius: 10px;
		background: rgba(250, 127, 128, 0.06);
		border: 1px solid rgba(250, 127, 128, 0.2);
		display: flex;
		flex-direction: column;
		gap: 8px;
	`

	return container
}
