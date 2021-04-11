import React, { useState } from "react";

interface Props {
    connect: (accessKey: string, secretKey: string) => void
}

export const UserKey: React.FC<Props> = (props: Props) => {
    const [ accessKey, setAccessKey ] = useState("");
    const [ secretKey, setSecretKey ] = useState("");

    return (
        <div className="flex mb-3 items-center">
            <div className="mr-3 pt-0 w-64">
                <input type="text"
                    placeholder="Access Key"
                    className="px-2 py-1.5
                        placeholder-blueGray-300 text-blueGray-600
                        relative bg-white rounded
                        text-sm border-0 shadow outline-none
                        focus:outline-none focus:ring w-full"
                    value={accessKey}
                    onChange={e => setAccessKey(e.target.value)}
                />
            </div>
            <div className="mr-3 pt-0 w-64">
                <input type="password"
                    placeholder="Secret Key"
                    className="px-2 py-1.5
                        placeholder-blueGray-300 text-blueGray-600
                        relative bg-white rounded
                        text-sm border-0 shadow outline-none
                        focus:outline-none focus:ring w-full"
                    value={secretKey}
                    onChange={e => setSecretKey(e.target.value)}
                />
            </div>
            <button className="bg-indigo-500 text-white active:bg-indigo-600
                        font-bold uppercase text-xs
                        px-4 py-2 rounded shadow hover:shadow-md outline-none
                        focus:outline-none
                        ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => props.connect(accessKey, secretKey)}>Connect</button>
        </div>
    );
}