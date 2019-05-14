import firebase, {firestore} from '../firebase'
import {OWNER, MANAGER} from '../constants/userTypes'
import {USER_LOGIN_NOT_ALLOWED} from '../constants/errors'

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SAVE_USER = 'SAVE_USER';

export const login = (id) => {
    return {
        type: LOGIN,
        payload: {
            id
        }
    }
};

export const logout = () => {
    return {
        type: LOGOUT,
        payload: {}
    }
};

export const saveUser = (id, user) => {
    return {
        type: SAVE_USER,
        payload: {
            id,
            user,
        }
    }
};

export const fetchLogin = (email, password) => {
    /**
     * Purpose: log the user in and save his userId
     */
    return dispatch => firebase.auth().signInWithEmailAndPassword(email, password)
        .then(auth => {
            dispatch(login(auth.user.uid));
            return {success: true, userId: auth.user.uid}
        })
        .catch(error => {
            console.warn(error);
            return {success: false, code: error.code}
        });
};

export const fetchUser = (userId) => {
/**
     * retrieve details of user from remote database and save on local
     */
    return dispatch => firestore.collection('users').doc(userId)
        .get()
        .then(
            (doc) => {
                if (!doc.exists) {
                    // implies that user credentials created but user not yet created in database
                    console.log('User document does not yet exist in db');
                    return {success: false}
                }
                const user = doc.data()
                if (user.userTypes.includes(OWNER) || user.userTypes.includes(MANAGER) ){
                    //if the signed in user is an owner or a manager
                    dispatch(saveUser(doc.id, user));
                    return {success: true}
                }
                return {success: false, code: USER_LOGIN_NOT_ALLOWED }
                
            }
        )
        .catch(error => {
            console.error(error);
            return false
        })
};