export const dataTestId = (id: string) => `[data-testid="${id}"]`
export const ariaLabel = (label: string) => `[aria-label="${label}"]`
export const dataComponent = (component: string) => `[data-component="${component}"]`

/**
 * Detect page type from URL
 */
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

export const hasAncestorWithAttribute = (element: Element | null, attribute: string, value: string) => {
	while (element) {
		if (element.getAttribute(attribute) === value) {
			return true
		}
		element = element.parentElement
	}
	return false
}

/**
 * Finds the comment anchor/link for a given element by traversing up the DOM
 * Returns the anchor hash (e.g., "#issuecomment-12345") or null
 */
export const findCommentAnchor = (element: Element | null): string | null => {
	let current = element

	while (current) {
		const id = current.id

		// Check for direct comment IDs (works for both Issues and PRs)
		if (id && id.startsWith("issuecomment-")) {
			return `#${id}`
		}
		if (id && id.startsWith("discussioncomment-")) {
			return `#${id}`
		}
		if (id && /^r\d+$/.test(id)) {
			return `#${id}`
		}

		// Issue body (React-based issues page)
		if (id === "issue-body-viewer") {
			return "#issue-body-viewer"
		}

		// PR body - look for the first comment which is the PR description
		if (current.classList.contains("timeline-comment") && current.closest(".js-discussion")) {
			// Check if this is the PR body (first comment)
			const parentItem = current.closest(".js-timeline-item")
			if (parentItem) {
				const commentContainer = parentItem.querySelector("[id^='issuecomment-']")
				if (commentContainer) {
					return `#${commentContainer.id}`
				}
			}
		}

		// Look for timestamp anchor links within comment that contain the hash
		// GitHub's React UI has links like "/owner/repo/issues/123#issuecomment-456"
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

			// Also try finding discussion comment links
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

		// Check timeline elements for data-url attributes
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

/**
 * Gets a display label for the comment type
 */
export const getCommentLabel = (anchor: string, index: number, pageType: PageType): string => {
	if (anchor === "#issue-body-viewer") {
		return "Issue"
	}
	// First comment on PR is the PR description
	if (pageType === "pull" && index === 0) {
		return "PR"
	}
	if (anchor.startsWith("#issuecomment-")) {
		return `Comment ${index}`
	}
	if (anchor.startsWith("#discussioncomment-")) {
		return `Discussion ${index}`
	}
	if (anchor.startsWith("#r")) {
		return `Review ${index}`
	}
	return `Comment ${index}`
}

/**
 * Checks if an anchor is for the issue/PR body (not a comment)
 */
export const isIssueBodyAnchor = (anchor: string): boolean => {
	return anchor === "#issue-body-viewer"
}
