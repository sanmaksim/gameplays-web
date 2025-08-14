import { CredentialPayload, UserPayload } from "../types/UserTypes";
import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (payload: CredentialPayload) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload
            })
        }),
        updateUser: builder.mutation({
            query: (payload: UserPayload) => ({
                url: `${USERS_URL}/${payload.userId}`,
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload
            })
        }),
        deleteUser: builder.mutation({
            query: (id: number) => ({
                url: `${USERS_URL}/${id}`,
                method: 'DELETE',
                credentials: 'include'
            })
        })
    })
});

export const { 
    useCreateUserMutation, 
    useUpdateUserMutation, 
    useDeleteUserMutation 
} = usersApiSlice;
