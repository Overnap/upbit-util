import React from "react";

interface Props {
    sortBy: string,
    updateSort: (newSortby: string) => void
}

export const CoinHeader: React.FC<Props> = (props: Props) => {
    return (
        <div className="relative rounded-lg bg-white overflow-x-auto">
            <div className="flex items-center px-4 pt-3 space-x-8 justify-between">
                <button className={`text-sm text-left
                        ${props.sortBy === "cd" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-28 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.updateSort("cd")}>시장 코드</button>
                <button className={`text-sm text-right
                        ${props.sortBy === "tp" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-24 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.updateSort("tp")}>현재가</button>
                <button className={`text-sm text-right
                        ${props.sortBy === "scr" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-20 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.updateSort("scr")}>전일대비</button>
                <button className={`text-sm text-right
                        ${props.sortBy === "atp24h" ? "text-gray-600 font-semibold" : "text-gray-400"}
                        w-20 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all`}
                        onClick={() => props.updateSort("atp24h")}>거래대금</button>
                <button className="text-sm text-right text-gray-400
                        w-3 hover:text-gray-600 outline-none focus:outline-none
                        ease-linear transition-all">…</button>
            </div>
        </div>
    );
}