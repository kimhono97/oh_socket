import { useEffect, useState } from 'react';
import styles from '../../styles/ActionPanel.module.css'
const NUM_ACTIONS = 10;

interface ActionPanelProps {
    selectedIndex?: number,
    disabled?: boolean,
    onAction?: (index: number)=>any,
};

const ActionPanel = ({ selectedIndex, disabled, onAction }: ActionPanelProps) => {
    return (
        <div className={styles.grid}>
            {(new Array(NUM_ACTIONS).fill(0).map((_, nIdx) => {
                const classNames = [styles.card];
                if (selectedIndex == nIdx) {
                    classNames.push(styles.selected);
                }
                return (
                    <button key={nIdx} disabled={disabled} className={classNames.join(" ")}
                        onFocus={(event) => {
                            if (onAction) {
                                onAction(nIdx);
                            }
                            setTimeout(() => {
                                if (document.activeElement == event.target) {
                                    event.target.blur();
                                }
                            }, 300);
                        }}>{nIdx}</button>
                );
            }))}
        </div>
    );
};

export default ActionPanel;