import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.parent}>
      <div className={styles.child}>
        <h1>ICE Partner API</h1>
        <ul>
          <li>
            <Link href="swagger">Swagger</Link>
          </li>
          <li>
            <Link href="ice-notification-service">
              Ice Notification Service
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
