export const testIsChange = () => ({
	type: 'CHANGE_TEST',
	nik: '099828828'
})

export const changeTest = () => dispatch => dispatch(testIsChange())