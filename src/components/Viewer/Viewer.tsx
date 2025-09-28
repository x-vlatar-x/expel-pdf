import { useEffect, useRef, useState } from "react"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { useGlobal } from "@/components/GlobalProvider/GlobalProvider"
import { PDFDocument } from "pdf-lib"
import * as fontkit from "fontkit"
import styles from "./Viewer.module.scss"
import loadingAnimation from "@/assets/animations/loading.json"
import statementUrl from "@/assets/documents/statement.pdf"
import fontUrl from "@/assets/fonts/times.ttf"
import downloadIcon from "@/assets/icons/download.svg"

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

function Viewer() {
    const {isStatementFormulated, setIsStatementFormulated, formData} = useGlobal()
    const [documentUrl, setDocumentUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const lottieRef = useRef<LottieRefCurrentProps>(null)

    useEffect(() => {
        lottieRef.current?.setSpeed(2)
    }, [lottieRef])


    useEffect(() => {
        if(isStatementFormulated && formData.firstName && formData.lastName && formData.patronymic && formData.faculty && formData.course && formData.group){
            const generate = async () => {
                setIsLoading(true)
                const canvas = canvasRef.current
                if(!canvas) return

                const context = canvas.getContext("2d")
                if(!context) return
                
                const minDelay = new Promise(resolve => setTimeout(resolve, 1000))
                const pdfJob = (async () => {
                    const statementBytes = await fetch(statementUrl).then(res => res.arrayBuffer())

                    const pdfDocument = await PDFDocument.load(statementBytes)
                    const page = pdfDocument.getPages()[0]
                
                    pdfDocument.registerFontkit(fontkit)
                    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer())
                    const timesFont = await pdfDocument.embedFont(fontBytes)

                    page.drawText(`${formData.faculty}`, {x: 375, y: 716.5, size: 14, font: timesFont})
                    page.drawText(`${formData.course}`, {x: 317.2, y: 679.5, size: 14, font: timesFont})
                    page.drawText(`${formData.group}`, {x: 408.5, y: 678.8, size: 14, font: timesFont})
                    page.drawText(`${formData.lastName} ${formData.firstName} ${formData.patronymic}`, {x: 317.2, y: 659, size: 14, font: timesFont})
                    
                    const date = (new Date()).toLocaleDateString("uk-UA", {day: "2-digit", month: "2-digit", year: "numeric"})
                    page.drawText(`${date}`, {x: 70, y: 550, size: 14, font: timesFont})
                    page.drawText(`${date}`, {x: 110, y: 475, size: 14, font: timesFont})

                    const pdfDocumentBytes = await pdfDocument.save()

                    const loadingTask = getDocument(pdfDocumentBytes.buffer as ArrayBuffer)
                    loadingTask.promise.then(async (pdf) => {
                        const page = await pdf.getPage(1)
                        const vieport = page.getViewport({scale: 1.5})

                        canvas.width = vieport.width
                        canvas.height = vieport.height


                        await page.render({
                            canvasContext: context,
                            viewport: vieport,
                            canvas: canvas
                        }).promise
                    })

                    const blob = new Blob([pdfDocumentBytes.buffer as ArrayBuffer], {type: "application/pdf"})
                    setDocumentUrl(URL.createObjectURL(blob))
                })()

                await Promise.all([pdfJob, minDelay])
                setIsLoading(false)
            }

            generate()
        } else {
            documentUrl && setDocumentUrl(null)
        }
    }, [canvasRef, isStatementFormulated])

    const handleDownloadClick = () => {
        if(documentUrl){
            const a = document.createElement("a")
            a.href = documentUrl
            a.download = "statement.pdf"
            a.click()
        }
    }

    return (
		<div className={`${styles.modal} ${isStatementFormulated && styles.open}`} onClick={() => setIsStatementFormulated(false)}>
            <div className={styles.container} style={{aspectRatio: 210 / 297}} onClick={(e) => e.stopPropagation()}>
                <canvas ref={canvasRef}/>
                <div className={`${styles.loading} ${isLoading && styles.active}`}>
                    <Lottie lottieRef={lottieRef} className={styles.animation} animationData={loadingAnimation} loop autoplay/>
                </div>
                <button disabled={isLoading} onClick={handleDownloadClick}>
                    <img src={downloadIcon}/>
                </button>
            </div>
        </div>
	)
}

export default Viewer