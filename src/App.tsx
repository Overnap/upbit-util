import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { UserKey } from './UserKey';
import { CoinInfo } from './CoinInfo';
import { CoinHeader } from './CoinHeader';

interface Tickers {
  [name: string]: any
}

const App: React.FC = () => {
  const priceWS = useRef<WebSocket | null>(null);
  const [ tickers, setTickers ] = useState<Tickers>({});
  const [ sortby, setSortby ] = useState("");

  useEffect(() => {
    priceWS.current = new WebSocket("wss://api.upbit.com/websocket/v1");

    priceWS.current.onopen = () => {
      console.log("price websocket connected.");
      priceWS.current?.send(`[{"ticket":"tgsdfng"},{"type":"ticker","codes":
                            ["KRW-BTC", "KRW-DOGE", "KRW-KMD", "KRW-SNT", "KRW-XRP", "KRW-XLM"]},
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
    <div className="flex justify-center">
      {/* main body */}
      <div className="mt-10 w-screen max-w-screen-lg">
        <div className="flex flex-col space-y-3 m-10">
          <div className="ml-3 mb-2 font-bold text-2xl">업비트 유틸리티</div>
          <UserKey connect={apiConnection}></UserKey>
          <CoinHeader sortby={sortby} setSortby={setSortby}></CoinHeader>
          <CoinInfo id="KRW-BTC" data={tickers["KRW-BTC"]}></CoinInfo>
          <CoinInfo id="KRW-DOGE" data={tickers["KRW-DOGE"]}></CoinInfo>
          <CoinInfo id="KRW-KMD" data={tickers["KRW-KMD"]}></CoinInfo>
          <CoinInfo id="KRW-SNT" data={tickers["KRW-SNT"]}></CoinInfo>
          <CoinInfo id="KRW-XRP" data={tickers["KRW-XRP"]}></CoinInfo>
          <CoinInfo id="KRW-XLM" data={tickers["KRW-XLM"]}></CoinInfo>
        </div>
      </div>
    </div>
  );
}

export default App;
