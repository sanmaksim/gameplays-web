import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            })
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile/${data.userId}`,
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            })
        }),
        deleteUser: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/profile`,
                method: 'DELETE',
                credentials: 'include'
            })
        })
    })
});

export const { 
    useRegisterMutation, 
    useUpdateUserMutation, 
    useDeleteUserMutation 
} = usersApiSlice;
