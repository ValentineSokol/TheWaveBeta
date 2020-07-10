import { configureStore } from 'redux-toolkit';
import root from './reducers/root';
export default configureStore({
    devTools: true,
    reducer: root
});