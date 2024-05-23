
import loadingGif from "../../assets/loading/book_loading.gif"
import styles from "./Loading.module.scss"

const Loading: React.FC = () => {

    return(
        <div className={`${styles.loadingContainer}`}>
            <img src={loadingGif} alt="Loading" />
            <p>Chvíli strpení, hledám archiválie...</p>
        </div>
    )
}

export default Loading;