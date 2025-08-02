export const dataTestId = (id: string) => `[data-testid="${id}"]`
export const ariaLabel = (label: string) => `[aria-label="${label}"]`
export const dataComponent = (component: string) => `[data-component="${component}"]`

export const hasAncestorWithAttribute = (element: Element | null, attribute: string, value: string) => {
	while (element) {
		if (element.getAttribute(attribute) === value) {
			return true
		}
		element = element.parentElement
	}
	return false
}