import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>OriHime Socket</title>
        <meta name="description" content="Test page for OriHime Socket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          OriHime Socket<br/>Test Page
        </h1>

        <p className={styles.description}>
          Select the Role
        </p>

        <div className={styles.grid}>
          <Link href={"/recv/"} className={styles.card}>
            <h2>Receiver &rarr;</h2>
            <p>Receive actions from senders. Join in a room, and the received action will be shown your screen.</p>
          </Link>

          <Link href="/send/" className={styles.card}>
            <h2>Sender &rarr;</h2>
            <p>Send actions to receivers. Make a room, and click the buttons shown your screen to send actions.</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://orihime.orylab.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OriHime.OryLab.com
        </a>
      </footer>
    </div>
  )
}

export default Home
