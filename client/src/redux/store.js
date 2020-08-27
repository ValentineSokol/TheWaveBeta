import { configureStore } from 'redux-toolkit';
import root from './reducers/root';
export default configureStore({
    reducer: root
});