import {
	ISSUE_SIDEBAR_ELEMENT,
	PR_SIDEBAR_ELEMENT,
} from "../constants/elements";

export const init = () => {
	if (ISSUE_SIDEBAR_ELEMENT) {
		ISSUE_SIDEBAR_ELEMENT.style.border = "1px solid red";
	}

	if (PR_SIDEBAR_ELEMENT) {
		PR_SIDEBAR_ELEMENT.style.border = "1px solid red";
	}
};
