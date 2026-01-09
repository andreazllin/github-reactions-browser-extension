import {ariaLabel, dataTestId, isPullRequestPage} from "../helpers/selectors"
import {COMMENTS_CONTAINER_ID, ISSUE_CONTAINER_ID, ISSUE_SIDEBAR_ID, PR_SIDEBAR_ID, REACTION_CONTAINER_ID} from "./id"

export const ISSUE_SIDEBAR_ELEMENT = document.querySelector<HTMLElement>(dataTestId(ISSUE_SIDEBAR_ID))

export const PR_SIDEBAR_ELEMENT = document.getElementById(PR_SIDEBAR_ID)

// Function to get fresh reaction containers each time (handles dynamically loaded comments)
export const getReactionsContainers = () => {
	if (isPullRequestPage()) {
		// PR page: reaction containers are in .js-comment-reactions-options or .comment-reactions
		return document.querySelectorAll(".js-comment-reactions-options")
	}
	// Issue/Discussion page: uses aria-label="Reactions"
	return document.querySelectorAll(ariaLabel(REACTION_CONTAINER_ID))
}

export const ISSUE_CONTAINER_ELEMENT = document.getElementById(ISSUE_CONTAINER_ID)

export const COMMENTS_CONTAINER_ELEMENT = document.getElementById(COMMENTS_CONTAINER_ID)
