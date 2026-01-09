import {Reactions} from "./components/reactions"
import {EXTENSION_CONTAINER_ID, ISSUE_SIDEBAR_ID, PR_SIDEBAR_ID} from "./constants/id"
import {init} from "./helpers/initialization"
import {hasAncestorWithAttribute} from "./helpers/selectors"

init()

let debounceTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_DELAY = 150 // ms

const updateReactions = () => {
	if (!/\/(discussions|issues|pull)\//.test(window.location.pathname)) {
		return
	}

	const container = document.getElementById(EXTENSION_CONTAINER_ID)
	if (container) {
		container.replaceChildren(Reactions())
	}
}

const observer = new MutationObserver((mutations: MutationRecord[]) => {
	// Check if any mutation is relevant (not in sidebar)
	const hasRelevantMutation = mutations.some(
		(mutation) =>
			!hasAncestorWithAttribute(mutation.target as Element | null, "data-testid", ISSUE_SIDEBAR_ID) &&
			!hasAncestorWithAttribute(mutation.target as Element | null, "id", PR_SIDEBAR_ID) &&
			!hasAncestorWithAttribute(mutation.target as Element | null, "id", EXTENSION_CONTAINER_ID)
	)

	if (!hasRelevantMutation) {
		return
	}

	if (debounceTimer) {
		// Debounce: wait for mutations to settle before updating
		clearTimeout(debounceTimer)
	}

	debounceTimer = setTimeout(() => {
		updateReactions()
		debounceTimer = null
	}, DEBOUNCE_DELAY)
})

observer.observe(document.body, {
	childList: true,
	subtree: true
})
