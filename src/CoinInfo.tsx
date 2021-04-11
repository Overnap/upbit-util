import React, { useState } from "react";

interface Props {
    data: any,
    id: string
}

export const CoinInfo: React.FC<Props> = (props: Props) => {
    const [chart, toggleChart] = useState(false);

    return (
        <div className="p-2">
            <div className="flex items-center">
                <div className="text-sx font-bold text-gray-800 mr-10">{props.id}</div>
                <div className="text-sm text-gray-800">{props.data?.tp} ₩</div>
                <button onClick={() => toggleChart(!chart)}>{ chart ? "-" : "+" }</button>
            </div>
            { chart ? "Chart" : null }
        </div>
    );
}