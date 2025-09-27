import styles from "./FormHeader.module.scss"

function FormHeader() {
    return (
		<div className={styles.FormHeader}>
            <h1 className={styles.logo}>
                <img src={"/ExpelPDF.svg"}/>
            </h1>
            <span className={styles.phrase}>Ще не відрахувався? Дій!</span>
            {/* <span className={styles.phrase}>Дій!</span> */}
        </div>
	)
}

export default FormHeader