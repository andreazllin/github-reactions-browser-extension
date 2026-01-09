import {getDiscussionComments, getReactionsContainers} from "../constants/elements"
import {
	dataComponent,
	findCommentAnchor,
	getCommentLabel,
	getPageType,
	isBodyAnchor,
	isDiscussionPage,
	isPullRequestPage
} from "../helpers/selectors"
import {Credits} from "./credits"

const emojiColors: Record<string, string> = {
	"👍": "59, 130, 246",
	"👎": "239, 68, 68",
	"😄": "251, 191, 36",
	"🎉": "168, 85, 247",
	"❤️": "244, 63, 94",
	"🚀": "14, 165, 233",
	"👀": "34, 197, 94",
	"😕": "251, 146, 60",
	"⬆️": "34, 197, 94"
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

type ReactionData = {
	emoji: string
	amount: string
}

const parseIssueReactions = (node: Element): ReactionData[] => {
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
		.filter((r): r is ReactionData => r !== null && r.emoji !== "" && r.amount !== "")
}

const parseClassicReactions = (node: Element): ReactionData[] => {
	const buttons = node.querySelectorAll("button[data-reaction-content]")

	return Array.from(buttons)
		.map((button) => {
			const text = button.textContent?.trim() || ""
			const match = text.match(/^(.+?)\s*(\d+)$/)
			if (match) {
				return {
					emoji: match[1].trim(),
					amount: match[2]
				}
			}
			return null
		})
		.filter((r): r is ReactionData => r !== null)
}

const findUpvoteForComment = (commentElement: Element): ReactionData | null => {
	const upvoteButton = commentElement.querySelector(".js-upvote-button")
	if (upvoteButton) {
		const text = upvoteButton.textContent?.trim() || ""
		const match = text.match(/^(\d+)/)
		if (match && Number.parseInt(match[1]) > 0) {
			return {
				emoji: "⬆️",
				amount: match[1]
			}
		}
	}

	const voteForm = commentElement.querySelector(".discussion-vote-form")
	if (voteForm) {
		const text = voteForm.textContent?.trim() || ""
		const match = text.match(/^(\d+)/)
		if (match && Number.parseInt(match[1]) > 0) {
			return {
				emoji: "⬆️",
				amount: match[1]
			}
		}
	}

	return null
}

type CommentData = {
	label: string
	href: string
	anchor: string | null
	reactions: ReactionData[]
	upvotes: ReactionData | null
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
	const isDiscussion = isDiscussionPage()
	let commentIndex = 0

	const commentsMap = new Map<string, CommentData>()

	Array.from(getReactionsContainers()).forEach((node) => {
		const anchor = findCommentAnchor(node)
		const key = anchor ?? "#unknown"

		const reactionButtons = isPR || isDiscussion ? parseClassicReactions(node) : parseIssueReactions(node)

		if (reactionButtons.length > 0) {
			const existing = commentsMap.get(key)
			if (existing) {
				existing.reactions = [...existing.reactions, ...reactionButtons]
			} else {
				commentsMap.set(key, {
					label: "",
					href: key,
					anchor,
					reactions: reactionButtons,
					upvotes: null
				})
			}
		}
	})

	if (isDiscussion) {
		Array.from(getDiscussionComments()).forEach((node) => {
			const anchor = findCommentAnchor(node)
			const key = anchor ?? "#unknown"
			const upvote = findUpvoteForComment(node)

			if (upvote) {
				const existing = commentsMap.get(key)
				if (existing) {
					existing.upvotes = upvote
				} else {
					commentsMap.set(key, {
						label: "",
						href: key,
						anchor,
						reactions: [],
						upvotes: upvote
					})
				}
			}
		})
	}

	const data = Array.from(commentsMap.values())
		.filter((item) => item.reactions.length > 0 || item.upvotes !== null)
		.map((item) => {
			if (item.anchor && !isBodyAnchor(item.anchor)) {
				commentIndex++
			}

			item.label = getCommentLabel(item.anchor ?? "#unknown", commentIndex, pageType)
			return item
		})

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

		const labelContainer = document.createElement("span")
		labelContainer.style.cssText = `
			display: flex;
			align-items: center;
			gap: 5px;
			min-width: 80px;
			flex-shrink: 0;
		`

		const icon = document.createElement("span")
		if (item.label === "PR") {
			icon.textContent = "🔀"
		} else if (item.label === "Discussion") {
			icon.textContent = "💭"
		} else if (item.anchor && isBodyAnchor(item.anchor)) {
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

		const reactionsContainer = document.createElement("div")
		reactionsContainer.style.cssText = `
			display: flex;
			flex-wrap: wrap;
			gap: 5px;
			align-items: center;
		`

		if (item.upvotes) {
			reactionsContainer.appendChild(createReactionPill(item.upvotes.emoji, item.upvotes.amount))
		}

		for (const reaction of item.reactions) {
			if (reaction.emoji && reaction.amount) {
				reactionsContainer.appendChild(createReactionPill(reaction.emoji, reaction.amount))
			}
		}

		row.appendChild(labelContainer)
		row.appendChild(reactionsContainer)
		reactions.appendChild(row)
	}

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

	reactions.appendChild(Credits())

	return reactions
}
