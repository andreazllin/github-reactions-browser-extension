import {ariaLabel, dataTestId, getPageType} from "../helpers/selectors"
import {COMMENTS_CONTAINER_ID, ISSUE_CONTAINER_ID, ISSUE_SIDEBAR_ID, PR_SIDEBAR_ID, REACTION_CONTAINER_ID} from "./id"

export const ISSUE_SIDEBAR_ELEMENT = document.querySelector<HTMLElement>(dataTestId(ISSUE_SIDEBAR_ID))

export const PR_SIDEBAR_ELEMENT = document.getElementById(PR_SIDEBAR_ID)

export const getReactionsContainers = () => {
	const pageType = getPageType()

	if (pageType === "pull" || pageType === "discussion") {
		return document.querySelectorAll(".js-comment-reactions-options")
	}

	return document.querySelectorAll(ariaLabel(REACTION_CONTAINER_ID))
}

export const getDiscussionComments = () => {
	return document.querySelectorAll(".js-discussion-comment, .discussion-timeline-item")
}

export const ISSUE_CONTAINER_ELEMENT = document.getElementById(ISSUE_CONTAINER_ID)

export const COMMENTS_CONTAINER_ELEMENT = document.getElementById(COMMENTS_CONTAINER_ID)
