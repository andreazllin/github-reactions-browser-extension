import {REACTIONS_CONTAINERS_ELEMENTS} from "../constants/elements"
import {dataComponent} from "../helpers/selectors"
// import {REACTIONS} from "../constants/reactions"

export const Reactions = () => {
	const reactions = document.createElement("div")

	// const issueUrl = window.location.origin + window.location.pathname + window.location.search

	// const findReaction = (node: Element) => (reaction: (typeof REACTIONS)[number]) =>
	// 	node.textContent?.includes(reaction.emoji) || node.querySelector(`g-emoji[alias="${reaction.name}"]`)

	const data = Array.from(REACTIONS_CONTAINERS_ELEMENTS)
		// .filter((node) => REACTIONS.some(findReaction(node)))
		.filter(({children}) => children.length > 1) // Only data-component="IconButton" as child (add reaction button)
		.map((node) => {
			const children = Array.from(node.children)

			const reactionButtons = children.map((child) => {
				if (
					child.tagName === "BUTTON" &&
					Array.from(child.children).some((child) => child.getAttribute("data-component") === "buttonContent")
				) {
					const emoji = child.querySelector(dataComponent("leadingVisual"))
					const amount = child.querySelector(dataComponent("text"))

					// Get just the bare text content, excluding nested span text
					let amountText = ""
					if (amount) {
						// Get all text nodes directly under the amount element
						const textNodes = Array.from(amount.childNodes)
							.filter((node) => node.nodeType === Node.TEXT_NODE)
							.map((node) => node.textContent?.trim())
							.filter(Boolean)
							.join("")
						amountText = textNodes
					}

					return {
						emoji: emoji?.textContent,
						amount: amountText
					}
				}
			})

			return reactionButtons.filter(Boolean)
		})

	reactions.innerHTML = data
		.map((reactionCollection) => {
			const reactionsHtml = reactionCollection
				.map((reaction) => {
					return `${reaction.emoji} ${reaction.amount}`
				})
				.join(" ")
			return `<div>${reactionsHtml}</div>`
		})
		.join("")

	return reactions
}
