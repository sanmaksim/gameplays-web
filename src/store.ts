import { apiSlice } from "./slices/apiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { rtkQueryErrorLogger } from "./middleware/errorMiddleware";
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                            .concat(
                                                apiSlice.middleware,
                                                rtkQueryErrorLogger
                                            ),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
