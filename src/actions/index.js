import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder';



export const fetchPostsAndUsers = () => async (dispatch, getState) => {
	await dispatch(fetchPosts());

	// const userIds = _.uniq(_.map(getState().posts, 'userId'));
	// userIds.forEach(userId => dispatch(fetchUser(userId)));

	// equivalent to the two lines commented above
	_.chain(getState().posts)
		.map('userId')
		.uniq()
		.forEach(userId => dispatch(fetchUser(userId)));
};


export const fetchPosts = () => async dispatch => {
	const response = await jsonPlaceholder.get('/posts');

	dispatch({
		type: 'FETCH_POSTS',
		payload: response.data
	});
};


export const fetchUser = userId => async dispatch => {
	const response = await jsonPlaceholder.get(`/users/${userId}`);

	dispatch({
		type: 'FETCH_USER',
		payload: response.data
	});
};


// alernative to fetchPostsAndUsers. Uses a memoized version of the fetchUser action to avoid unnecessary repeated calls; 
// if called with the same arguments more than once, just returns same result as the first time without actually executing.
// note: cannot memoize fetchUser directly, would not work correctly because of currying
/*
export const fetchUser = userId => dispatch => _fetchUser(userId, dispatch);
const _fetchUser = _.memoize(async (userId, dispatch) => {
	const response = await jsonPlaceholder.get(`/users/${userId}`);

	dispatch({
		type: 'FETCH_USER',
		payload: response.data
	});
});
*/