export const loginUser = async (username: string, password: string) => {
    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
};
