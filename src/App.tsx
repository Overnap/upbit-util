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
  const sortBy = useRef("cd");
  const sortOrder = useRef(false); // false: inc, true: dec
  const [ tickers, setTickers ] = useState<Tickers>({});
  const [ ordered, setOrdered ] = useState<string[]>([]);

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
        if (!ordered.includes(data.cd)) {
          ordered.push(data.cd);
        }
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

  const updateSort = (newSortBy: string) => {
    if (sortBy.current === newSortBy) {
      sortOrder.current = !sortOrder.current;
    } else {
      sortBy.current = newSortBy;
      sortOrder.current = false;
    }

    ordered.sort((a: string, b: string) => {
      let result;

      if (sortBy.current === "cd") {
        result = a.localeCompare(b);
      } else {
        result = tickers[a][sortBy.current] - tickers[b][sortBy.current];
      }

      if (sortOrder.current === true) {
        return result;
      } else {
        return -result;
      }
    });

    console.log(ordered);
  }

  return (
    <div className="flex justify-center">
      {/* main body */}
      <div className="mt-10 w-screen max-w-screen-lg">
        <div className="flex flex-col space-y-3 m-10">
          <div className="ml-3 mb-2 font-bold text-2xl">업비트 유틸리티</div>
          <UserKey connect={apiConnection}></UserKey>
          <CoinHeader sortBy={sortBy.current} updateSort={updateSort}></CoinHeader>
          {ordered.map((id: string) => (<CoinInfo key={id} id={id} data={tickers[id]}></CoinInfo>))}
        </div>
      </div>
    </div>
  );
}

export default App;
