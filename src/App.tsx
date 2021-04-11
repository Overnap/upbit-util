import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { UserKey } from './UserKey';
import { CoinInfo } from './CoinInfo'

interface Tickers {
  [name: string]: any
}

const App: React.FC = () => {
  const priceWS = useRef<WebSocket | null>(null);
  const [ tickers, setTickers ] = useState<Tickers>({});

  useEffect(() => {
    priceWS.current = new WebSocket("wss://api.upbit.com/websocket/v1");

    priceWS.current.onopen = () => {
      console.log("price websocket connected.");
      priceWS.current?.send(`[{"ticket":"tgsdfng"},{"type":"ticker","codes":
                            ["KRW-BTC", "KRW-DOGE", "KRW-KMD"]},
                            {"format":"SIMPLE"}]`);
    }

    priceWS.current.onmessage = (e: MessageEvent) => {
      e.data.text().then((result: string) => {
        const data = JSON.parse(result);
        setTickers(prevTickers => { return {...prevTickers, [data.cd]: data} });
      });
    };

    return () => {
      priceWS.current?.close();
    }
  }, []);

  const apiConnection = (accessKey: string, secretKey: string) => {
    console.log(accessKey);
    console.log(secretKey);
  };

  return (
    <div className="m-20">
      <header className="flex flex-col space-y-3">
        <UserKey connect={apiConnection}></UserKey>
        <CoinInfo id="KRW-BTC" data={tickers["KRW-BTC"]}></CoinInfo>
        <CoinInfo id="KRW-DOGE" data={tickers["KRW-DOGE"]}></CoinInfo>
        <CoinInfo id="KRW-KMD" data={tickers["KRW-KMD"]}></CoinInfo>
      </header>
    </div>
  );
}

export default App;
