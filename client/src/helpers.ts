export default function mockWindowProperty(property: any, value: any) {
	const { [property]: originalProperty } = window;
	delete window[property];
	beforeAll(() => {
		Object.defineProperty(window, property, {
			configurable: true,
			writable: true,
			value,
		});
	});
	afterAll(() => {
		window[property] = originalProperty;
	});
}
