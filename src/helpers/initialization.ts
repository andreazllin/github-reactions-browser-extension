import {Container} from "../components/container"
import {Reactions} from "../components/reactions"
import {ISSUE_SIDEBAR_ELEMENT, PR_SIDEBAR_ELEMENT} from "../constants/elements"

export const init = () => {
	console.log("== KOREKOI: INITIALIZING ==")
	const container = Container()
	console.log("== KOREKOI: CREATED CONTAINER ==")
	container.appendChild(Reactions())

	if (ISSUE_SIDEBAR_ELEMENT) {
		console.log("== KOREKOI: APPENDING TO ISSUE SIDEBAR ==")
		ISSUE_SIDEBAR_ELEMENT.appendChild(container)
	}

	if (PR_SIDEBAR_ELEMENT) {
		console.log("== KOREKOI: APPENDING TO PR SIDEBAR ==")
		PR_SIDEBAR_ELEMENT.appendChild(container)
	}
	console.log("== KOREKOI: INITIALIZED ==")
}
