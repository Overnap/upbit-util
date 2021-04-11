import React, { useState } from "react";

interface Props {
    connect: (accessKey: string, secretKey: string) => void
}

export const UserKey: React.FC<Props> = (props: Props) => {
    const [ accessKey, setAccessKey ] = useState("");
    const [ secretKey, setSecretKey ] = useState("");

    return (
        <div className="UserKey">
            <input type="text"
                placeholder="Access Key"
                value={accessKey}
                onChange={e => setAccessKey(e.target.value)}
            />
            <input type="password"
                placeholder="Secret Key"
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
            />
            <button onClick={() => props.connect(accessKey, secretKey)}>
                API Connect
            </button>
        </div>
    );
}