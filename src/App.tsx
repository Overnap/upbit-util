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
      priceWS.current?.send(`[{"ticket":"tgang"},{"type":"ticker","codes":["KRW-BTC"]},{"format":"SIMPLE"}]`);
    }

    priceWS.current.onmessage = (e: MessageEvent) => {
      e.data.text().then((result: string) => {
        const data = JSON.parse(result);
        setTickers({
          ...tickers,
          [data.cd]: data
        });
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
      <header>
        <UserKey connect={apiConnection}></UserKey>
        <CoinInfo id="KRW-BTC" data={tickers["KRW-BTC"]}></CoinInfo>
      </header>
    </div>
  );
}

export default App;
