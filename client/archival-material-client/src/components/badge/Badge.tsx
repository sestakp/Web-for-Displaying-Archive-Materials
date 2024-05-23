import react from "react";
import styles from "./Badge.module.scss"

interface BadgeProps {
    value: number;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Badge: react.FC<BadgeProps> = ({ value, className, onClick  }) => {



    return(
        <div className={`${styles.badge} ${className}`} onClick={onClick}>
        {<span className={styles.badgeValue}>{value ?? 0}</span>}
        </div>
    )
}

export default Badge;