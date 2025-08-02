import {Reactions} from "./components/reactions"
import {COMMENTS_CONTAINER_ELEMENT, ISSUE_CONTAINER_ELEMENT} from "./constants/elements"
import {EXTENSION_CONTAINER_ID, ISSUE_SIDEBAR_ID, PR_SIDEBAR_ID} from "./constants/id"
import {init} from "./helpers/initialization"
import {hasAncestorWithAttribute} from "./helpers/selectors"

init()

const observer = new MutationObserver((mutations: MutationRecord[]) => {
	for (const mutation of mutations) {
		// Skip if the mutation happens on the sidebar
		if (
			hasAncestorWithAttribute(mutation.target as Element | null, "data-testid", ISSUE_SIDEBAR_ID) ||
			hasAncestorWithAttribute(mutation.target as Element | null, "id", PR_SIDEBAR_ID)
		) {
			continue
		}

		if (/\/(discussions|issues|pull)\//.test(window.location.pathname)) {
			document.getElementById(EXTENSION_CONTAINER_ID)?.replaceChildren(Reactions())
		}
	}
})

// Start observing mutations on the whole document

// observer.observe(document, {
// 	childList: true,
// 	subtree: true
// })

const dnone = "laksjd"

if (ISSUE_CONTAINER_ELEMENT) {
	observer.observe(ISSUE_CONTAINER_ELEMENT, {
		childList: true,
		subtree: true
	})
}

if (COMMENTS_CONTAINER_ELEMENT) {
	observer.observe(COMMENTS_CONTAINER_ELEMENT, {
		childList: true,
		subtree: true
	})
}