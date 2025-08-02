import {init} from "./helpers/initialization"

init()

// const observer = new MutationObserver((mutations: MutationRecord[]) => {
// 	for (const mutation of mutations) {
// 		if (
// 			hasAncestorWithId(mutation.target as Element | null, sideBarId.replace('#', '')) ||
// 			hasAncestorWithId(mutation.target as Element | null, wrapperId.replace('#', ''))
// 		) {
// 			continue
// 		}

// 		// Check if the URL contains /discussions/ or /issues/
// 		if (/\/(discussions|issues|pull)\//.test(window.location.pathname)) {
// 			addReactionNav()
// 		}
// 	}
// })

// // Start observing mutations on the whole document
// observer.observe(document, {
// 	childList: true,
// 	subtree: true
// })
