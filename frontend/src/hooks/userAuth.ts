import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    email: string;
    role: string;
    username: string;
}

function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        const kakaoToken = localStorage.getItem("kakaoAccessToken");

        let apiUrl = "http://localhost:8088/api/users/me"; // 백엔드의 전체 URL로 변경
        let token = authToken;

        if (kakaoToken) {
            apiUrl = "http://localhost:8088/api/users/meKaKao"; // Kakao 사용자 API URL로 변경
            token = kakaoToken;
        }

        if (token) {
            axios
                .get<User>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return { user, loading };
}

export default useAuth;
