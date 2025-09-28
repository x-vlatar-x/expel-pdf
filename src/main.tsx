import { GlobalProvider } from '@/components/GlobalProvider/GlobalProvider.tsx'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<GlobalProvider>
		<App/>
	</GlobalProvider>
)
