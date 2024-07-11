import {authKey} from '../constant/storageKey';
import {decodeToken} from '../utils/jwt';
import { getFromLocalStorage, setLocalStorage } from '../utils/local-storage';

export const setUserInfo = ({ accessToken }) => {
    return setLocalStorage(authKey, accessToken);
}

export const getUserInfo = () => {
    const authToken = getFromLocalStorage(authKey);
    if (authToken) {
        try {
            const decodedToken = decodeToken(authToken);
            if (decodedToken && decodedToken.userId) { // Kiểm tra xem token có chứa userId hay không
                return decodedToken;
            } else {
                console.error('Token does not contain userId');
                return null;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } else {
        console.error('No auth token found in local storage');
        return null;
    }
};

export const isLoggedIn = () => {
    const authToken = getFromLocalStorage(authKey);
    return !!authToken;
}
export const loggedOut = () => {
    return localStorage.removeItem(authKey)
}