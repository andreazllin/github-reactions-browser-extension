export const Credits = () => {
	const credits = document.createElement("div")
	credits.style.cssText = `
		font-size: 10px;
		color: var(--fgColor-muted, #8b949e);
		text-align: center;
		padding: 8px 0 2px;
		margin-top: 4px;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
		letter-spacing: 0.5px;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	`
	credits.textContent = "✨ Reactions by Korekoi"

	credits.addEventListener("mouseenter", () => {
		credits.style.opacity = "1"
	})
	credits.addEventListener("mouseleave", () => {
		credits.style.opacity = "0.7"
	})

	return credits
}
