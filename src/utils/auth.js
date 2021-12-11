import jwt_decode from "jwt-decode";
import axios from "axios";

export async function getAccessToken() {
    const accessToken = localStorage.getItem("accessToken");
    console.log(`access token in ls: ${accessToken}`)
    if (accessToken) {
        const expTime = jwt_decode(accessToken).exp;
        if (expTime * 1000 > new Date().getTime()) {
            console.log("not expired")
            return accessToken;
        }
    }
    const refreshToken = localStorage.getItem('refreshToken');
    console.log(`refresh token in ls: ${refreshToken}`)
    if (refreshToken) {
        console.log("refresh token exists")
        console.log(refreshToken)
        await axios.post(`https://fast-api-walking-v1.herokuapp.com/token`, {}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })
            .then((response) => {
                const accessToken = response.data.access_token;
                const refreshToken = response.data.refresh_token;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                console.log(accessToken);
                return accessToken;
            })
            .catch((err) => {
                // Refresh token is expired
                console.log(refreshToken)
                console.log(err);
                logout()
                return null;
            })
    } else {
        console.log(await getRefreshToken());
        logout();
        return null;
    }
}

export async function setAccessToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
}

export async function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export async function setRefreshToken(refreshToken){
    localStorage.setItem("refreshToken", refreshToken);
}

export default function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}
