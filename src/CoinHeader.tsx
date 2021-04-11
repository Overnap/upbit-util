import React, { useState } from "react";

interface Props {
    sortby: string,
    setSortby: (newSortby: string) => void
}

export const CoinHeader: React.FC<Props> = (props: Props) => {
    return (
        <div className="relative rounded-lg bg-white overflow-x-auto">
            <div className="flex items-center px-4 pt-3 space-x-8 justify-between">
                <button className={`text-sm text-left
                        ${props.sortby === "cd" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-28 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.setSortby("cd")}>시장 코드</button>
                <button className={`text-sm text-right
                        ${props.sortby === "tp" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-24 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.setSortby("tp")}>현재가</button>
                <button className={`text-sm text-right
                        ${props.sortby === "scr" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-20 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.setSortby("scr")}>전일대비</button>
                <button className={`text-sm text-right
                        ${props.sortby === "atp24h" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-20 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.setSortby("atp24h")}>거래대금</button>
                <button className="w-3"></button>
            </div>
        </div>
    );
}