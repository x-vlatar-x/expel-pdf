import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GlobalProvider } from './components/GlobalProvider/GlobalProvider.tsx'

createRoot(document.getElementById('root')!).render(
	<GlobalProvider>
		<App/>
	</GlobalProvider>
)
