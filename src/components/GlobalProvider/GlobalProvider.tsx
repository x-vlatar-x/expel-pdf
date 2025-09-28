import type { ExpelForm } from "@/interfaces/ExpelFom"
import type { Nullable } from "@/types/nullable"
import { createContext, useContext, useEffect, useState } from "react"

type GlobalContextType = {
    isStatementFormulated: boolean
    setIsStatementFormulated: React.Dispatch<React.SetStateAction<boolean>>
    isFormValid: boolean
    setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>
    formData: Nullable<ExpelForm>
    setFormData: React.Dispatch<React.SetStateAction<Nullable<ExpelForm>>>
    history: HistoryElement[]
    setHistoryElement: (element: ExpelForm) => void
}

interface HistoryElement extends ExpelForm {
    date: Date
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({children}: {children: React.ReactNode}) {
    const [isStatementFormulated, setIsStatementFormulated] = useState<boolean>(false)
    // const [isStatementFormulated, setIsStatementFormulated] = useState<boolean>(true)
    const [isFormValid, setIsFormValid] = useState<boolean>(false)
    const [formData, setFormData] = useState<Nullable<ExpelForm>>({firstName: null, lastName: null, patronymic: null, faculty: null, course: null, group: null})
    const [history, setHistory] = useState<HistoryElement[]>([])

    useEffect(() => {
        const savedHistory = localStorage.getItem("history")

        if(savedHistory){
            const parsed: HistoryElement[] = JSON.parse(savedHistory)

            const fixed = parsed.map(item => ({
                ...item, date: new Date(item.date)
            }))

            setHistory(fixed)
        } else {
            setHistory([])
        }
    }, [])

    const setHistoryElement = (element: ExpelForm) => {
        if(history.length < 6){
            localStorage.setItem("history", JSON.stringify([...history, {...element, date: new Date()}]))
            setHistory([...history, {...element, date: new Date()}])
        } else {
            const array = [...history]
            array.splice(0, 1)
            localStorage.setItem("history", JSON.stringify([...array, {...element, date: new Date()}]))
            setHistory([...array, {...element, date: new Date()}])
        }
    }

    return (
        <GlobalContext.Provider value={{isStatementFormulated, setIsStatementFormulated, isFormValid, setIsFormValid, formData, setFormData, history, setHistoryElement}}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobal(): GlobalContextType {
    const context = useContext(GlobalContext)

    if(!context){
        throw new Error("No context")
    }

    return context
}
