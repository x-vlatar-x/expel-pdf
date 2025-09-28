import { useGlobal } from "@/components/GlobalProvider/GlobalProvider"
import styles from "./FormSidebar.module.scss"
import statementIcon from "@/assets/icons/statement.svg"
import logo from "@/assets/logo/large-logo.svg"

function FormSidebar() {
    const {isFormValid} = useGlobal()

    return (
		<div className={styles.FormSidebar}>
            <h1 className={styles.logo}>
                <img src={logo}/>
            </h1>
            <span className={styles.phrase}>Ще не відрахувався? Дій!</span>
            <button type="submit" form="dataForm" disabled={!isFormValid}>
                Сформувати заяву
                <img src={statementIcon}/>
            </button>
        </div>
	)
}

export default FormSidebar