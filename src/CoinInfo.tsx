import React, { useState } from "react";

interface Props {
    data: any,
    id: string
}

export const CoinInfo: React.FC<Props> = (props: Props) => {
    const [chart, toggleChart] = useState(false);

    return (
        <div className="relative rounded-lg bg-white shadow max-w-max">
            <div className="flex items-center px-4 py-3 space-x-8 justify-between">
                <div className="text-sx font-bold text-gray-800 w-28">{props.id}</div>
                <div className="text-sm text-gray-800 w-24 text-right">{props.data?.tp} ₩</div>
                <div className={`text-sm ${props.data?.c == 'RISE' ? "text-red-500" : "text-blue-600"}
                        w-20 text-right`}>
                    {(Math.round(props.data?.scr.toFixed(4) * 10000) / 100).toFixed(2) + "%"}
                </div>
                <div className="text-sm text-gray-800 w-20 text-right">
                    {Math.round(props.data?.atp24h / 1000000000)} B₩
                </div>
                <button className="text-gray-400 active:text-gray-800 text-sx
                            outline-none focus:outline-none ease-linear transition-all duration-100"
                        onClick={() => toggleChart(!chart)}>{ chart ? "－" : "＋" }</button>
            </div>
            <div className={"transition-height duration-300 ease-in-out overflow-hidden "
                    + (chart ? "h-40" : "h-0")}>
                <div className="p-4">HELLO WORLD!</div>
            </div>
        </div>
    );
}