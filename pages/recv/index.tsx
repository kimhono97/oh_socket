import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import ActionPanel from '../comp/actionPanel'

import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>|null>(null);
    const [roomNames, setRoomNames] = useState<string[]>(new Array());
    const [roomId, setRoomId] = useState<string>("");
    const [actionValue, setActionValue] = useState<number>(-1);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout|null>(null);

    useEffect(() => {
        if (!socket) {
            const soc = io("ws://" + location.host);
            setSocket(soc);
            soc.on("allRooms", (strRooms: string) => {
                setRoomNames([""].concat(JSON.parse(strRooms)));
            });
            soc.on("numData", (data: string) => {
                const nValue = parseInt(data);
                if (!isNaN(nValue)) {
                    setActionValue(nValue);
                    if (timeoutId != null) {
                        clearTimeout(timeoutId);
                    }
                    setTimeoutId(setTimeout(() => {
                        setActionValue(-1);
                        setTimeoutId(null);
                    }, 300));
                }
            });
            soc.emit("getAllRooms");
        }
    }, []);
    useEffect(() => {
        if (!socket) return;
        if (roomId) {
            socket.emit("moveToRoom", roomId);
        } else {
            socket.emit("leaveRooms");
        }
    }, [roomId]);

    return (
        <div className={styles.container}>
        <Head>
            <title>OriHime Socket : Receiver</title>
            <meta name="description" content="Test page for OriHime Socket Receiver" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            <p className={styles.rolename}>Receiver</p>
            {roomNames.length > 0 ? (
                <div style={{
                    width: "200px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <span style={{
                        margin: "0 1rem",
                    }}>Room :</span>
                    <select value={roomId} style={{
                        flex: "1 1 auto",
                        borderRadius: "0",
                        padding: "0.5rem",
                    }} onChange={(event) => {
                        setRoomId(prev => {
                            return event.target.selectedOptions[0].value;
                        });
                    }}>
                        {roomNames.map((roomId, ri) => {
                            return <option key={ri} value={roomId}>{roomId}</option>
                        })}
                    </select>
                </div>
            ) : (
                <span>Now Loading Room List...</span>
            )}
            <hr className={styles.divider}/>
            <ActionPanel disabled={true} selectedIndex={actionValue} />
        </main>
        </div>
    )
}

export default Home
