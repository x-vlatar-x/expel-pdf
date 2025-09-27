import Form from "./components/Form/Form"
import "./App.scss"
import Viewer from "./components/Viewer/Viewer"
import { useEffect, useRef } from "react"
import FormFooter from "./components/FormFooter/FormFooter"
import FormSidebar from "./components/FormSidebar/FormSidebar"
import FormHeader from "./components/FormHeader/FormHeader"

function App() {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const container = containerRef.current
        if (container) {
            container.scrollTop = container.scrollHeight
        }
	}, [])

	return (
		<main>
			<div className={"container"}>
				<FormHeader/>
				<Form/>
				<FormSidebar/>
				<FormFooter/>
				<Viewer/>
			</div>
			<div className={"blur"}></div>
			<div className={`figure figure-1`}></div>
			<div className={`figure figure-2`}></div>
			<div className={`figure figure-3`}></div>
			<div className={`figure figure-4`}></div>
			<div className={`figure figure-5`}></div>
		</main>
	)
}

export default App
