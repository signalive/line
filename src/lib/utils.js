import assign from 'lodash/assign';


function promiseDelay(ms) {
	return new Promise(resolve => setTimeout(_ => resolve(), ms))
}


function retry(task, options = {}) {
	const defaults = {maxDelay: 160, maxCount: 0, initialDelay: 3, increaseFactor: 2};
	options = assign(defaults, options);
	let timeout;
	let counter = 1;
	let delay = options.initialDelay;

	const once = function() {
		return task()
			.catch(err => {
				counter++;
				delay = delay * options.increaseFactor;

				if (options.maxCount != 0 && counter > options.maxCount) {
					timeout && clearTimeout(timeout);
					throw err;
				}
				return promiseDelay(delay * 1000 / 2).then(_ => once());
			});
	}

	return once();
}


// http://stackoverflow.com/a/6248722
function generateDummyId(length = 4) {
	return ("0000" + (Math.random()*Math.pow(36,length) << 0).toString(36)).slice(-length);
}


module.exports = {promiseDelay, retry, generateDummyId};