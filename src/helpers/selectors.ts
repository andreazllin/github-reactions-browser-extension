export const dataTestId = (id: string) => `[data-testid="${id}"]`
export const ariaLabel = (label: string) => `[aria-label="${label}"]`
export const dataComponent = (component: string) => `[data-component="${component}"]`

export type PageType = "issue" | "pull" | "discussion" | "unknown"

export const getPageType = (): PageType => {
	const path = window.location.pathname
	if (/\/issues\/\d+/.test(path)) return "issue"
	if (/\/pull\/\d+/.test(path)) return "pull"
	if (/\/discussions\/\d+/.test(path)) return "discussion"
	return "unknown"
}

export const isPullRequestPage = () => getPageType() === "pull"
export const isIssuePage = () => getPageType() === "issue"
export const isDiscussionPage = () => getPageType() === "discussion"

export const hasAncestorWithAttribute = (element: Element | null, attribute: string, value: string) => {
	while (element) {
		if (element.getAttribute(attribute) === value) {
			return true
		}
		element = element.parentElement
	}
	return false
}

export const findCommentAnchor = (element: Element | null): string | null => {
	let current = element

	while (current) {
		const id = current.id

		if (id?.startsWith("issuecomment-")) {
			return `#${id}`
		}
		if (id?.startsWith("discussioncomment-")) {
			return `#${id}`
		}
		if (id?.startsWith("discussion-") && !id.startsWith("discussion-bucket")) {
			return `#${id}`
		}
		if (id && /^r\d+$/.test(id)) {
			return `#${id}`
		}

		if (id === "issue-body-viewer") {
			return "#issue-body-viewer"
		}

		if (current.classList.contains("timeline-comment") && current.closest(".js-discussion")) {
			const parentItem = current.closest(".js-timeline-item")
			if (parentItem) {
				const commentContainer = parentItem.querySelector("[id^='issuecomment-']")
				if (commentContainer) {
					return `#${commentContainer.id}`
				}
			}
		}

		if (current.classList.contains("react-issue-comment")) {
			const timestampLink = current.querySelector('a[href*="#issuecomment-"]')
			if (timestampLink) {
				const href = timestampLink.getAttribute("href")
				if (href) {
					const hashIndex = href.indexOf("#issuecomment-")
					if (hashIndex !== -1) {
						return href.substring(hashIndex)
					}
				}
			}

			const discussionLink = current.querySelector('a[href*="#discussioncomment-"]')
			if (discussionLink) {
				const href = discussionLink.getAttribute("href")
				if (href) {
					const hashIndex = href.indexOf("#discussioncomment-")
					if (hashIndex !== -1) {
						return href.substring(hashIndex)
					}
				}
			}
		}

		const dataUrl = current.getAttribute("data-url")
		if (dataUrl) {
			const commentMatch = dataUrl.match(/#(issuecomment-\d+|discussioncomment-\d+|r\d+)/)
			if (commentMatch) {
				return `#${commentMatch[1]}`
			}
		}

		current = current.parentElement
	}

	return null
}

export const getCommentLabel = (anchor: string, index: number, pageType: PageType): string => {
	if (anchor === "#issue-body-viewer") {
		return "Issue"
	}
	if (anchor.startsWith("#discussion-") && !anchor.startsWith("#discussioncomment-")) {
		return "Discussion"
	}
	if (pageType === "pull" && index === 0) {
		return "PR"
	}
	if (anchor.startsWith("#issuecomment-")) {
		return `Comment ${index}`
	}
	if (anchor.startsWith("#discussioncomment-")) {
		return `Comment ${index}`
	}
	if (anchor.startsWith("#r")) {
		return `Review ${index}`
	}
	return `Comment ${index}`
}

export const isBodyAnchor = (anchor: string): boolean => {
	return (
		anchor === "#issue-body-viewer" ||
		(anchor.startsWith("#discussion-") && !anchor.startsWith("#discussioncomment-"))
	)
}

export const isIssueBodyAnchor = isBodyAnchor
