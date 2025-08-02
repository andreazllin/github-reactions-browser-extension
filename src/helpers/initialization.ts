import {Container} from "../components/container"
import {Credits} from "../components/credits"
import {ISSUE_SIDEBAR_ELEMENT, PR_SIDEBAR_ELEMENT} from "../constants/elements"

export const init = () => {
	const container = Container()
	container.appendChild(Credits())

	if (ISSUE_SIDEBAR_ELEMENT) {
		ISSUE_SIDEBAR_ELEMENT.appendChild(container)
	}

	if (PR_SIDEBAR_ELEMENT) {
		PR_SIDEBAR_ELEMENT.appendChild(container)
	}
}
