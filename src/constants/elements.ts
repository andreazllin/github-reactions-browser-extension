import { dataTestId } from "../helpers/selectors";
import { ISSUE_SIDEBAR_ID, PR_SIDEBAR_ID } from "./id";

export const ISSUE_SIDEBAR_ELEMENT = document.querySelector<HTMLElement>(
	dataTestId(ISSUE_SIDEBAR_ID),
);

export const PR_SIDEBAR_ELEMENT = document.getElementById(PR_SIDEBAR_ID);
