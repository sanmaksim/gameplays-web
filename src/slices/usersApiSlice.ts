import { CredentialRequest, UserRequest } from "../types/UserTypes";
import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (data: CredentialRequest) => ({
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
            query: (data: UserRequest) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
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
