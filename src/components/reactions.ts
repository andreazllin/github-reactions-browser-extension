import {getReactionsContainers} from "../constants/elements"
import {
	dataComponent,
	findCommentAnchor,
	getCommentLabel,
	getPageType,
	isIssueBodyAnchor,
	isPullRequestPage
} from "../helpers/selectors"
import {Credits} from "./credits"

// Emoji to subtle tint color mapping
const emojiColors: Record<string, string> = {
	"👍": "59, 130, 246", // blue
	"👎": "239, 68, 68", // red
	"😄": "251, 191, 36", // amber
	"🎉": "168, 85, 247", // purple
	"❤️": "244, 63, 94", // rose
	"🚀": "14, 165, 233", // sky
	"👀": "34, 197, 94", // green
	"😕": "251, 146, 60" // orange
}

const getEmojiColor = (emoji: string): string => {
	return emojiColors[emoji] || "128, 128, 128"
}

const createReactionPill = (emoji: string, amount: string) => {
	const color = getEmojiColor(emoji)

	const pill = document.createElement("span")
	pill.style.cssText = `
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 3px 8px;
		border-radius: 100px;
		background: rgba(${color}, 0.12);
		border: 1px solid rgba(${color}, 0.2);
		font-size: 11px;
		line-height: 1.4;
		transition: background 0.15s ease, border-color 0.15s ease;
		cursor: pointer;
	`

	const emojiSpan = document.createElement("span")
	emojiSpan.textContent = emoji
	emojiSpan.style.fontSize = "13px"

	const countSpan = document.createElement("span")
	countSpan.textContent = amount
	countSpan.style.cssText = `
		font-weight: 600;
		color: rgb(${color});
		font-family: "SF Mono", "Fira Code", monospace;
		font-size: 11px;
		letter-spacing: -0.5px;
	`

	pill.appendChild(emojiSpan)
	pill.appendChild(countSpan)

	pill.addEventListener("mouseenter", () => {
		pill.style.background = `rgba(${color}, 0.2)`
		pill.style.borderColor = `rgba(${color}, 0.35)`
	})
	pill.addEventListener("mouseleave", () => {
		pill.style.background = `rgba(${color}, 0.12)`
		pill.style.borderColor = `rgba(${color}, 0.2)`
	})

	return pill
}

// Parse reactions from Issue/Discussion page (React-based UI)
const parseIssueReactions = (node: Element) => {
	const children = Array.from(node.children)

	return children
		.map((child) => {
			if (
				child.tagName === "BUTTON" &&
				Array.from(child.children).some((c) => c.getAttribute("data-component") === "buttonContent")
			) {
				const emoji = child.querySelector(dataComponent("leadingVisual"))
				const amount = child.querySelector(dataComponent("text"))

				let amountText = ""
				if (amount) {
					const textNodes = Array.from(amount.childNodes)
						.filter((n) => n.nodeType === Node.TEXT_NODE)
						.map((n) => n.textContent?.trim())
						.filter(Boolean)
						.join("")
					amountText = textNodes
				}

				return {
					emoji: emoji?.textContent || "",
					amount: amountText
				}
			}
			return null
		})
		.filter(Boolean)
}

// Parse reactions from PR page (classic UI)
const parsePRReactions = (node: Element) => {
	// PR reactions are buttons with data-reaction-content and text like "😄 1"
	const buttons = node.querySelectorAll("button[data-reaction-content]")

	return Array.from(buttons)
		.map((button) => {
			const text = button.textContent?.trim() || ""
			// Text format is like "😄 1" or "👍 5"
			const match = text.match(/^(.+?)\s*(\d+)$/)
			if (match) {
				return {
					emoji: match[1].trim(),
					amount: match[2]
				}
			}
			return null
		})
		.filter(Boolean)
}

export const Reactions = () => {
	const reactions = document.createElement("div")
	reactions.style.cssText = `
		display: flex;
		flex-direction: column;
		gap: 8px;
	`

	const pageType = getPageType()
	const isPR = isPullRequestPage()
	let commentIndex = 0

	const data = Array.from(getReactionsContainers())
		.map((node) => {
			const anchor = findCommentAnchor(node)

			// Parse reactions based on page type
			const reactionButtons = isPR ? parsePRReactions(node) : parseIssueReactions(node)

			// Skip if no reactions
			if (reactionButtons.length === 0) {
				return null
			}

			// Increment index for comments
			if (anchor && !isIssueBodyAnchor(anchor)) {
				commentIndex++
			}

			const label = getCommentLabel(anchor ?? "#issue-body-viewer", commentIndex, pageType)
			const href = anchor ?? "#issue-body-viewer"

			return {
				label,
				href,
				anchor,
				reactions: reactionButtons
			}
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)

	// Create styled rows for each comment with reactions
	for (const item of data) {
		const row = document.createElement("a")
		row.href = item.href
		row.style.cssText = `
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 8px 10px;
			border-radius: 8px;
			background: rgba(128, 128, 128, 0.06);
			border: 1px solid rgba(128, 128, 128, 0.1);
			transition: background 0.15s ease, transform 0.15s ease;
			text-decoration: none;
			cursor: pointer;
		`

		row.addEventListener("mouseenter", () => {
			row.style.background = "rgba(128, 128, 128, 0.12)"
			row.style.transform = "translateX(2px)"
		})
		row.addEventListener("mouseleave", () => {
			row.style.background = "rgba(128, 128, 128, 0.06)"
			row.style.transform = "translateX(0)"
		})

		// Label with icon
		const labelContainer = document.createElement("span")
		labelContainer.style.cssText = `
			display: flex;
			align-items: center;
			gap: 5px;
			min-width: 80px;
			flex-shrink: 0;
		`

		const icon = document.createElement("span")
		// Different icons for PR body vs Issue body vs comments
		if (item.label === "PR") {
			icon.textContent = "🔀"
		} else if (item.anchor && isIssueBodyAnchor(item.anchor)) {
			icon.textContent = "📝"
		} else {
			icon.textContent = "💬"
		}
		icon.style.cssText = `
			font-size: 11px;
			opacity: 0.8;
		`

		const labelText = document.createElement("span")
		labelText.textContent = item.label
		labelText.style.cssText = `
			color: var(--fgColor-accent, #58a6ff);
			font-weight: 600;
			font-size: 12px;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
		`

		labelContainer.appendChild(icon)
		labelContainer.appendChild(labelText)

		// Reactions container
		const reactionsContainer = document.createElement("div")
		reactionsContainer.style.cssText = `
			display: flex;
			flex-wrap: wrap;
			gap: 5px;
			align-items: center;
		`

		for (const reaction of item.reactions) {
			if (reaction?.emoji && reaction?.amount) {
				reactionsContainer.appendChild(createReactionPill(reaction.emoji, reaction.amount))
			}
		}

		row.appendChild(labelContainer)
		row.appendChild(reactionsContainer)
		reactions.appendChild(row)
	}

	// Empty state
	if (data.length === 0) {
		const emptyState = document.createElement("div")
		emptyState.style.cssText = `
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 16px;
			gap: 6px;
		`

		const emptyIcon = document.createElement("span")
		emptyIcon.textContent = "🫥"
		emptyIcon.style.cssText = `
			font-size: 20px;
			opacity: 0.6;
		`

		const emptyText = document.createElement("span")
		emptyText.textContent = "No reactions yet"
		emptyText.style.cssText = `
			color: var(--fgColor-muted, #8b949e);
			font-size: 12px;
			font-style: italic;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
		`

		emptyState.appendChild(emptyIcon)
		emptyState.appendChild(emptyText)
		reactions.appendChild(emptyState)
	}

	// Always add credits at the bottom
	reactions.appendChild(Credits())

	return reactions
}
