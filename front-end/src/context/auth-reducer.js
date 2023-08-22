export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        isAuthenticated: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        isAuthenticated: true,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        isAuthenticated: false,
      };
    case "UPDATE_USER":
      return {
        user: action.payload,
        isFetching: false,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};
