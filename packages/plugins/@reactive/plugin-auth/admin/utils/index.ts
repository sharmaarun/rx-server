import { eraseCookie, getCookie, setCookie } from "@reactive/commons"

/**
 * Returns auth token from the cookies
 * @returns 
 */
export const extractAuthTokenFromCookies = () => {
    try {
        const token = getCookie("_t")
        return token
    } catch (e) {
        console.error(e)
        return;
    }
}

/**
 * Set token into cookies
 * @param token 
 * @returns 
 */
export const setAuthToken = (token: string) => {
    try {
        return setCookie("_t", token)
    } catch (e) {
        console.error(e)
    }
}

/**
 * Erase auth token in cookies
 * @param token 
 * @returns 
 */
export const removeAuthToken = () => {
    try {
        return eraseCookie("_t")
    } catch (e) {
        console.error(e)
    }
}