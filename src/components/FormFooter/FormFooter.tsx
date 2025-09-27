import { useGlobal } from "../GlobalProvider/GlobalProvider"
import styles from "./FormFooter.module.scss"

function FormFooter() {
    const {isFormValid} = useGlobal()

    return (
		<div className={styles.FormFooter}>
            <button type="submit" form="dataForm" disabled={!isFormValid}>
                Сформувати заяву
            </button>
        </div>
	)
}

export default FormFooter