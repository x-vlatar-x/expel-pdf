import styles from "./FormHeader.module.scss"
import logo from "@/assets/logo/large-logo.svg"

function FormHeader() {
    return (
		<div className={styles.FormHeader}>
            <h1 className={styles.logo}>
                <img src={logo}/>
            </h1>
            <span className={styles.phrase}>Ще не відрахувався? Дій!</span>
        </div>
	)
}

export default FormHeader