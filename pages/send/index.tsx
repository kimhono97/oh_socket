import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import ActionPanel from '../comp/actionPanel'
import { useState } from 'react'

const Home: NextPage = () => {
    const [roomId, setRoomId] = useState<string>((new Date()).getTime().toString(16));
    return (
        <div className={styles.container}>
        <Head>
            <title>OriHime Socket : Sender</title>
            <meta name="description" content="Test page for OriHime Socket Sender" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            <p className={styles.rolename}>Sender</p>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "1rem",
            }}>
                <div>Room ID</div>
                <input type="text" value={roomId} style={{
                    flex: "1 1 auto",
                    padding: "0.5rem",
                    margin: "0.5rem",
                    textAlign: "center",
                }} onChange={(event) => {
                    setRoomId(prev => event.target.value);
                }} />
            </div>
            <div style={{
                width: "200px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
            }}>
                <button onClick={() => {
                    fetch(location.origin + `/api/create`)
                        .then(res => res.json())
                        .then(resJson => {
                            if (resJson.roomId) {
                                setRoomId(prev => resJson.roomId);
                            }
                        });
                }}>New Room</button>
                <button onClick={() => {
                    fetch(location.origin + `/api/clear`);
                }}>Clear Rooms</button>
            </div>
            <hr className={styles.divider}/>
            <ActionPanel onAction={selIndex => {
                if (roomId) {
                    fetch(location.origin + `/api/sendNumber?room=${roomId}&data=${selIndex}`);
                }
            }}/>
        </main>
        </div>
    )
}

export default Home
