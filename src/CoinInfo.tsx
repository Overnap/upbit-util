import React, { useState } from "react";

interface Props {
    data: any,
    id: string
}

export const CoinInfo: React.FC<Props> = (props: Props) => {
    const [chart, toggleChart] = useState(false);

    return (
        <div className="CoinSummary">
            <div className="head">
                <div className="CoinId">{props.id}</div>
                <div className="CoinPrice">{props.data.tp}</div>
                <button onClick={() => toggleChart(!chart)}>{ chart ? "-" : "+" }</button>
            </div>
            { chart ? "Chart" : null }
        </div>
    );
}