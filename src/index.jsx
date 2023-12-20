import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {AppProvider} from './context';

ReactDOM.createRoot(document.getElementById('root')).render(
  //Strict Mode helps detect and highlight potential problems in your application during development.
	<React.StrictMode> 
    <AppProvider>
		<App />
    </AppProvider>
	</React.StrictMode>
)