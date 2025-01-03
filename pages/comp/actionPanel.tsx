import styles from '../../styles/ActionPanel.module.css'

const NUMBERS = [0].concat((new Array(7)).fill(0).map((_, index) => Math.pow(2, index)));

interface ActionPanelProps {
    selectedValue?: number,
    disabled?: boolean,
    onAction?: (index: number)=>any,
    isSequential?: boolean,
};

const makeCard = (value: number, props: ActionPanelProps) => {
    const { selectedValue, disabled, onAction, isSequential } = props;
    const classNames = [styles.card, styles.small];
    if (selectedValue == value) {
        classNames.push(styles.selected);
    }
    return (
        <button key={value} disabled={disabled} className={classNames.join(" ")}
            onFocus={(event) => {
                if (onAction) {
                    onAction(value);
                }
                setTimeout(() => {
                    if (document.activeElement == event.target) {
                        event.target.blur();
                    }
                }, 300);
            }}>{value}</button>
    );
};

const makeDummyCard = () => {
    return (
        <div className={styles.card} style={{
            opacity: "0"
        }}></div>
    );
};

const ActionPanel = (props: ActionPanelProps) => {
    const { selectedValue, disabled, onAction, isSequential } = props;
    if (isSequential) {
        return (
            <div className={styles.grid}>
                {NUMBERS.map(value => {
                    return makeCard(value, props);
                })}
            </div>
        );
    }
    return (
        <div className={styles.table}>
            <div className={styles.row}>
                <div className={styles.col}>L</div>
                <div className={styles.col}></div>
                <div className={styles.col}>R</div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>{makeCard(1, props)}</div>
                <div className={styles.col}>{makeCard(64, props)}</div>
                <div className={styles.col}>{makeCard(4, props)}</div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>{makeCard(16, props)}</div>
                <div className={styles.col}>{makeDummyCard()}</div>
                <div className={styles.col}>{makeCard(32, props)}</div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>{makeCard(2, props)}</div>
                <div className={styles.col}>{makeDummyCard()}</div>
                <div className={styles.col}>{makeCard(8, props)}</div>
            </div>
            <div className={styles.row}>
                <div className={styles.col}>{makeCard(0, props)}</div>
            </div>
        </div>
    );
};

export default ActionPanel;