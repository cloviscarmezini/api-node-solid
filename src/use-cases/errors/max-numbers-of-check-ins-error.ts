export class MaxNumbersOfCheckInsError extends Error {
	constructor() {
		super('Max numbers of check-ins reached.');
	}
}