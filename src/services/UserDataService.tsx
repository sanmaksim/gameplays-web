import type UserType from '../types/UserType';

const apiUrl = 'https://localhost:5001'

async function registerUser(data: UserType) {
    try {
        const response = await fetch(`${apiUrl}/api/users/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        return user;

    } catch (error) {
        throw error;
    }
}

async function authUser(data: UserType) {
    try {
        const response = await fetch(`${apiUrl}/api/users/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        return user;

    } catch (error) {
        throw error;
    }
}

async function fetchUser() {
    try {
        const response = await fetch(`${apiUrl}/api/users/profile`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user: UserType = await response.json();
        return user;

    } catch (error) {
        throw error;
    }
}

async function updateUser(data: UserType) {
    try {
        const response = await fetch(`${apiUrl}/api/users/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        throw error;
    }
}

async function logoutUser() {
    try {
        const response = await fetch(`${apiUrl}/api/users/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        throw error;
    }
}

export { fetchUser, authUser, registerUser, updateUser, logoutUser };
