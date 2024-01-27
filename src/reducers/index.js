import {combineReducers} from 'redux';
import DataReducer from './reducer-data';

const allReducers = combineReducers({
	data: DataReducer,
});

export default allReducers;
