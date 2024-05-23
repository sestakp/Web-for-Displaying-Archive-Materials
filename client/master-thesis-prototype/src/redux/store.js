
import thunk from 'redux-thunk'; // Middleware for asynchronous actions
import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Add any additional middleware here
});

export default store;
