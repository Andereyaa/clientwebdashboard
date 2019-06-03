import * as types from '../actions'
import {initialState} from './index'

//STATE
// users: {
//     usersById: {},
//     userIds: [],
//     selectedId: null,
//     authenticatedUserIsAuthorized: false,
//     authenticatedUserId: null,
// }

const usersReducer = (state = initialState.users, action = {}) => {
    const {type, payload} = action;
    const usersById = {...state.usersById};
    switch (type) {
        case types.LOGIN: {
            return {
                ...state,
                authenticatedUserId: payload.id,
            }
        }

        case types.SET_AUTHENTICATED_USER_IS_AUTHORIZED: {
            return {
                ...state,
                authenticatedUserIsAuthorized: payload.isAuthorized
            }
        }

        case types.LOGOUT:
            return initialState.users;

        case types.SAVE_USER:
            usersById[payload.id] = {id: payload.id, ...usersById[payload.id], ...payload.user};
            return {
                ...state,
                userIds: Object.keys(usersById),
                usersById,
            };
        default:
            return state
    }
};

export default usersReducer