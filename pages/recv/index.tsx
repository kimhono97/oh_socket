import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import ActionPanel from '../comp/actionPanel'

import { useEffect, useRef, useState } from 'react';

const Home: NextPage = () => {
    const ws = useRef<WebSocket|null>(null);
    const timeoutId = useRef<NodeJS.Timeout|null>(null);
    const [roomNames, setRoomNames] = useState<string[]>(new Array());
    const [roomId, setRoomId] = useState<string>("");
    const [actionValue, setActionValue] = useState<number>(-1);
    const [isSequential, setSequential] = useState<boolean>(false);

    useEffect(() => {
        console.log("useEffect []");
        const socket = new WebSocket(`ws://${location.hostname}:3001`);
        socket.addEventListener("error", console.error);
        socket.addEventListener("close", console.warn);
        socket.addEventListener("message", ev => {
            console.log("msg!!", ev.data);
            const data = JSON.parse(ev.data.toString());
            switch (data.type) {
                case "allRooms":
                    setRoomNames([""].concat(data.data));
                    return;
                case "numData":
                    const nValue = data.data as number;
                    if (!isNaN(nValue)) {
                        setActionValue(nValue);
                        if (timeoutId.current != null) {
                            clearTimeout(timeoutId.current);
                        }
                        timeoutId.current = setTimeout(() => {
                            setActionValue(-1);
                            timeoutId.current = null;
                        }, 300);
                    }
                    return;
            }
        });
        if (socket.readyState == socket.OPEN) {
            console.log("already OPEN - Send");
            socket.send(JSON.stringify({
                type: "getAllRooms"
            }));
        } else {
            socket.addEventListener("open", ev => {
                console.log("OPEN - Send");
                socket.send(JSON.stringify({
                    type: "getAllRooms"
                }));
            });
        }
        ws.current = socket;
    }, []);
    useEffect(() => {
        const socket = ws.current;
        if (!socket || socket.readyState != socket.OPEN) return;
        console.log("useEffect [roomId]", roomId);
        if (roomId) {
            socket.send(JSON.stringify({
                type: "moveToRoom",
                roomId
            }));
        } else {
            socket.send(JSON.stringify({
                type: "leaveRooms",
            }));
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
                    }}>Room:</span>
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
            <div style={{ marginBottom: "1em" }}>
                <label htmlFor="chkSeqView">
                    <input type="checkbox" id="chkSeqView" checked={isSequential} onChange={ev => {
                        setSequential(ev.target.checked);
                    }}/>
                    Sequantial View
                </label>
            </div>
            <ActionPanel disabled={true} selectedValue={actionValue} isSequential={isSequential} />
        </main>
        </div>
    )
}

export default Home
