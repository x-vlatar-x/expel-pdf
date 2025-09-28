import { useEffect, useRef, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useGlobal } from "@/components/GlobalProvider/GlobalProvider"
import type { ExpelForm } from "@/interfaces/ExpelFom"
import { groups } from "@/data/groups"
import { courses } from "@/data/courses"
import { faculties } from "@/data/faculties"
import styles from "./Form.module.scss"
import * as yup from "yup"

import clearIcon from "@/assets/icons/clear.svg"
import historyIcon from "@/assets/icons/history.svg"
import loadIcon from "@/assets/icons/load.svg"

const schema: yup.ObjectSchema<ExpelForm> = yup.object({
    firstName: yup.string()
        .required('Обов\'язкове поле!')
        .matches(
            /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії'-\s]+$/,
            'Дозволені тільки українські літери, апостроф, дефіс та пробіл!'
        )
        .min(2, 'Не менше 2 символів!')
        .max(40, 'Не більше 40 символів!'),
    lastName: yup.string()
        .required('Обов\'язкове поле!')
        .matches(
            /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії'-\s]+$/,
            'Дозволені тільки українські літери, апостроф, дефіс та пробіл!'
        )
        .min(2, 'Не менше 2 символів!')
        .max(40, 'Не більше 40 символів!'),
    patronymic: yup.string()
        .required('Обов\'язкове поле!')
        .matches(
            /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії'-\s]+$/,
            'Дозволені тільки українські літери, апостроф, дефіс та пробіл!'
        )
        .min(2, 'Не менше 2 символів!')
        .max(40, 'Не більше 40 символів!'),
    faculty: yup.string()
        .required('Обов\'язкове поле!')
        .oneOf(faculties, 'Оберіть факультет із списку!'),
    course: yup.string()
        .required('Обов\'язкове поле!')
        .oneOf(courses, 'Оберіть номер курсу зі списку!'),
    group: yup.string()
        .required('Обов\'язкове поле!')
        .oneOf(groups, 'Оберіть групу із списку!')
}).required()

function Form() {
    const {setIsStatementFormulated, setIsFormValid, formData, setFormData, history, setHistoryElement} = useGlobal()
    const {register, handleSubmit, watch, setValue, resetField, formState: {errors, isValid}} = useForm<ExpelForm>({mode: 'onChange', resolver: yupResolver(schema)})
    const [openSelect, setOpenSelect] = useState<"faculty" | "course" | "group" | null>(null)
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)

    const facultyFieldRef = useRef<HTMLInputElement>(null)
    const courseFieldRef = useRef<HTMLInputElement>(null)
    const groupFieldRef = useRef<HTMLInputElement>(null)
    const facultiesListRef = useRef<HTMLDivElement>(null)
    const coursesListRef = useRef<HTMLDivElement>(null)
    const groupsListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsFormValid(isValid)
    }, [isValid])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const facultyField = facultyFieldRef.current
            const courseField = courseFieldRef.current
            const groupField = groupFieldRef.current

            if(!facultyField || !courseField || !groupField) return

            const facultyFieldRect = facultyField.getBoundingClientRect()
            const courseFieldRect = courseField.getBoundingClientRect()
            const groupFieldRect = groupField.getBoundingClientRect()

            if(
                (e.clientX > facultyFieldRect.x && e.clientX < facultyFieldRect.x + facultyFieldRect.width && 
                e.clientY > facultyFieldRect.y && e.clientY < facultyFieldRect.y + facultyFieldRect.height) ||
                (e.clientX > courseFieldRect.x && e.clientX < courseFieldRect.x + courseFieldRect.width && 
                e.clientY > courseFieldRect.y && e.clientY < courseFieldRect.y + courseFieldRect.height) ||
                (e.clientX > groupFieldRect.x && e.clientX < groupFieldRect.x + groupFieldRect.width && 
                e.clientY > groupFieldRect.y && e.clientY < groupFieldRect.y + groupFieldRect.height)
            ){
                e.stopPropagation()
            } else {
                setOpenSelect(null)
            }
        }

        document.addEventListener("click", handleClickOutside)
        
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [facultyFieldRef, courseFieldRef, groupFieldRef, openSelect])

    useEffect(() => {
        const handleResize = () => {
            const facultyField = facultyFieldRef.current
            const courseField = courseFieldRef.current
            const groupField = groupFieldRef.current

            if(!facultyField || !courseField || !groupField) return

            const facultiesList = facultiesListRef.current
            const coursesList = coursesListRef.current
            const groupsList = groupsListRef.current

            if(!facultiesList || !coursesList || !groupsList) return

            const facultyFieldRect = facultyField.getBoundingClientRect()
            const courseFieldRect = courseField.getBoundingClientRect()
            const groupFieldRect = groupField.getBoundingClientRect()

            facultiesList.style.top = `${facultyFieldRect.y + facultyFieldRect.height + 10}px`
            facultiesList.style.left = `${facultyFieldRect.x}px`
            facultiesList.style.width = `${facultyFieldRect.width - 3}px`

            coursesList.style.top = `${courseFieldRect.y + courseFieldRect.height + 10}px`
            coursesList.style.left = `${courseFieldRect.x}px`
            coursesList.style.width = `${courseFieldRect.width - 3}px`
            
            groupsList.style.top = `${groupFieldRect.y + groupFieldRect.height + 10}px`
            groupsList.style.left = `${groupFieldRect.x}px`
            groupsList.style.width = `${groupFieldRect.width - 3}px`
        }
        
        document.fonts.ready
            .then(() => {
                requestAnimationFrame(handleResize)
                window.addEventListener("resize", handleResize)
            })

        return () => window.removeEventListener("resize", handleResize)
    }, [facultyFieldRef, courseFieldRef, groupFieldRef, facultiesListRef, coursesListRef, groupsListRef])

    const facultyValue = watch("faculty", "")
    const courseValue = watch("course", "")
    const groupValue = watch("group", "")

    const filteredFaculties = faculties.filter(faculty =>
        faculty.toLowerCase().includes(facultyValue.toLowerCase())
    )

    const filteredGroups = groups.filter(group => 
        group.toLowerCase().includes(groupValue.toLowerCase())
    )

    const filteredCourses = courses.filter(course => 
        course.toLowerCase().includes(courseValue.toLowerCase())
    )

    const handleHistoryElementLoad = (index: number) => {
        const historyElement = history[index]
        setValue("lastName", historyElement.lastName, {shouldValidate: true})
        setValue("firstName", historyElement.firstName, {shouldValidate: true})
        setValue("patronymic", historyElement.patronymic, {shouldValidate: true})
        setValue("faculty", historyElement.faculty, {shouldValidate: true})
        setValue("course", historyElement.course, {shouldValidate: true})
        setValue("group", historyElement.group, {shouldValidate: true})
        setIsHistoryOpen(false)
    }

    const onSubmit = (data: ExpelForm) => {
        const changed = formData.firstName !== data.firstName 
            || formData.lastName !== data.lastName 
            || formData.patronymic !== data.patronymic 
            || formData.faculty !== data.faculty
            || formData.course !== data.course || formData.group !== data.group
        
        changed && setHistoryElement(data)
        setFormData({...data})
        setIsStatementFormulated(true)
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.title}>
                    <h3>Введіть свої дані</h3>
                </div>
                <button className={styles.historyButton} type="button" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
                    <img src={historyIcon}/>
                </button>
                <form id="dataForm" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${styles.historyList} ${isHistoryOpen && styles.open}`}>
                        {history.length > 0 && history.map((historyElement, historyElementIndex) => <div key={historyElementIndex}>
                            <span className={styles.name}>Прізвище:</span><span>{historyElement.lastName}</span>
                            <span className={styles.name}>Ім'я:</span><span>{historyElement.firstName}</span>
                            <span className={styles.name}>По батькові:</span><span>{historyElement.patronymic}</span>
                            <span className={styles.name}>Факультет / Інститут:</span><span>{historyElement.faculty}</span>
                            <span className={styles.name}>Курс:</span><span>{historyElement.course}</span>
                            <span className={styles.name}>Група:</span><span>{historyElement.group}</span>
                            <span className={styles.date}>{
                                `${historyElement.date.toLocaleTimeString("uk-UA", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}${"  "}
                                ${historyElement.date.toLocaleDateString("uk-UA", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                })}`
                            }</span>
                            <button type={"button"} onClick={() => handleHistoryElementLoad(historyElementIndex)}>
                                <img src={loadIcon}/>
                            </button>
                        </div>)}
                    </div>
                    <div className={`${styles.field} ${errors.lastName?.message && styles.error}`}>
                        <div className={styles.name}>
                            <label>{"Прізвище (родовий відмінок)"}</label>
                        </div>
                        <input {...register("lastName")} maxLength={40} autoComplete="off" placeholder="Шевченка"></input>
                        {watch("lastName") && <button className={styles.clear} type="button" onClick={() => resetField("lastName")}>
                            <img src={clearIcon}/>
                        </button>}
                        <span>{errors.lastName?.message}</span>
                    </div>
                    <div className={`${styles.field} ${errors.firstName?.message && styles.error}`}>
                        <div className={styles.name}>
                            <label>{"Ім'я (родовий відмінок)"}</label>
                        </div>
                        <input {...register("firstName")} maxLength={40} autoComplete="off" placeholder="Тараса"></input>
                        {watch("firstName") && <button className={styles.clear} type="button" onClick={() => resetField("firstName")}>
                            <img src={clearIcon}/>
                        </button>}
                        <span>{errors.firstName?.message}</span>
                    </div>
                    <div className={`${styles.field} ${errors.patronymic?.message && styles.error}`}>
                        <div className={styles.name}>
                            <label>{"По батькові (родовий відмінок)"}</label>
                        </div>
                        <input {...register("patronymic")} maxLength={40} autoComplete="off" placeholder="Григоровича"></input>
                        {watch("patronymic") && <button className={styles.clear} type="button" onClick={() => resetField("patronymic")}>
                            <img src={clearIcon}/>
                        </button>}
                        <span>{errors.patronymic?.message}</span>
                    </div>
                    <div className={`${styles.select} ${errors.faculty?.message && styles.error}`}>
                        <div className={styles.name}>
                            <label>{"Факультет / Інститут"}</label>
                        </div>
                        <input {...register("faculty")} ref={(e) => {
                            register("faculty").ref(e)
                            facultyFieldRef.current = e
                        }} autoComplete="off" placeholder="НН ІПСА" onFocus={() => setOpenSelect("faculty")}/>
                        {watch("faculty") && <button className={styles.clear} type="button" onClick={() => resetField("faculty")}>
                            <img src={clearIcon}/>
                        </button>}
                        <span>{errors.faculty?.message}</span>
                    </div>
                    <div className={`${styles.select} ${errors.course?.message && styles.error}`}>
                        <div className={styles.name}>
                            <label>{"Курс"}</label>
                        </div>
                        <input {...register("course")} ref={(e) => {
                            register("course").ref(e)
                            courseFieldRef.current = e
                        }} autoComplete="off" placeholder="1" onFocus={() => setOpenSelect("course")}/>
                        {watch("course") && <button className={styles.clear} type="button" onClick={() => resetField("course")}>
                            <img src={clearIcon}/>
                        </button>}
                        <span>{errors.course?.message}</span>
                    </div>
                    <div className={`${styles.select} ${errors.group?.message && styles.error}`}>
                        <div className={styles.name}>
                            <label>{"Група"}</label>
                        </div>
                        <input {...register("group")} ref={(e) => {
                            register("group").ref(e)
                            groupFieldRef.current = e
                        }} autoComplete="off" placeholder="ОМ-52" onFocus={() => setOpenSelect("group")}/>
                        {watch("group") && <button className={styles.clear} type="button" onClick={() => resetField("group")}>
                            <img src={clearIcon}/>
                        </button>}
                        <span>{errors.group?.message}</span>
                    </div>
                </form>
            </div>
            <div ref={facultiesListRef} className={`${styles.select__list} ${openSelect === "faculty" && styles.open}`}>
                {filteredFaculties.length > 0 ? filteredFaculties.map((faculty, facultyIndex) => 
                    <button key={facultyIndex} type="button" onClick={() => {
                        if(!(faculty === facultyValue)){
                            setValue("faculty", faculty, {
                                shouldValidate: true
                            })
                            setOpenSelect(null)
                        }
                    }}>{faculty}{faculty === facultyValue && <span>- вже обрано</span>}</button>
                ) : <span>Нічого не знайдено</span>}
            </div>
            <div ref={coursesListRef} className={`${styles.select__list} ${openSelect === "course" && styles.open}`}>
                {filteredCourses.length > 0 ? filteredCourses.map((course, courseIndex) => 
                    <button key={courseIndex} type="button" onClick={() => {
                        if(!(course === courseValue)){
                            setValue("course", course, {
                                shouldValidate: true
                            })
                            setOpenSelect(null)
                        }
                    }}>{course}{course === courseValue && <span>- вже обрано</span>}</button>
                ) : <span>Нічого не знайдено</span>}
            </div>
            <div ref={groupsListRef} className={`${styles.select__list} ${openSelect === "group" && styles.open}`}>
                {filteredGroups.length > 0 ? filteredGroups.map((group, groupIndex) => 
                    <button key={groupIndex} type="button" onClick={() => {
                        if(!(group === groupValue)){
                            setValue("group", group, {
                                shouldValidate: true
                            })
                            setOpenSelect(null)
                        }
                    }}>{group}{group === groupValue && <span>- вже обрано</span>}</button>
                ) : <span>Нічого не знайдено</span>}
            </div>
        </>
	)
}

export default Form
