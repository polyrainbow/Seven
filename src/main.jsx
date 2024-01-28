import { Provider } from "react-redux";
import allReducers from './reducers/index.js';
import { createRoot } from 'react-dom/client';
import Page from './components/Page.jsx';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: allReducers,
});

const app = document.getElementById("app");
const root = createRoot(app);

root.render(
	<Provider {... { store }}>
		<Page/>
	</Provider>
);
