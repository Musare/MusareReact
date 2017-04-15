import api from "api";

export const TEST_ACTION = "TEST_ACTION";

export const TEST_ASYNC_ACTION_START = "TEST_ASYNC_ACTION_START";
export const TEST_ASYNC_ACTION_ERROR = "TEST_ASYNC_ACTION_ERROR";
export const TEST_ASYNC_ACTION_SUCCESS = "TEST_ASYNC_ACTION_SUCCESS";

export function testAction() {
	return {
		type: TEST_ACTION,
	};
}

function testAsyncStart() {
	return {
		type: TEST_ASYNC_ACTION_START,
	};
}

function testAsyncSuccess(data) {
	return {
		type: TEST_ASYNC_ACTION_SUCCESS,
		data,
	};
}

function testAsyncError(error) {
	return {
		type: TEST_ASYNC_ACTION_ERROR,
		error,
	};
}

export function testAsync() {
	return function (dispatch) {
		dispatch(testAsyncStart());

		api.testAsync()
			.then(data => dispatch(testAsyncSuccess(data)))
			.catch(error => dispatch(testAsyncError(error)));
	};
}

// Update
