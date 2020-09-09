import { configureStore } from '@reduxjs/toolkit';
import root from './reducers/root';
export default configureStore({
    reducer: root
});