import { useGlobal } from "../GlobalProvider/GlobalProvider"
import styles from "./FormSidebar.module.scss"

function FormSidebar() {
    const {isFormValid} = useGlobal()

    return (
		<div className={styles.FormSidebar}>
            <h1 className={styles.logo}>
                <img src={"/ExpelPDF.svg"}/>
            </h1>
            <span className={styles.phrase}>Ще не відрахувався? Дій!</span>
            <button type="submit" form="dataForm" disabled={!isFormValid}>
                Сформувати заяву
                <img src={"/statement.svg"}/>
            </button>
        </div>
	)
}

export default FormSidebar