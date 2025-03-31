let portal: HTMLElement | null = null;

export function setPortal(element: HTMLElement) {
	portal = element;
}

export function teleport(node: HTMLElement) {
	if (!portal) {
		console.error("[teleport] Portal is not set up!")
		node.remove();
		return {};
	}

	portal.appendChild(node);

	return {
		destroy() {
			node.remove();
		}
	}
}