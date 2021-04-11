import React, { useEffect, useState, useRef } from 'react';
import { Map, List } from 'immutable'
import './App.css';
import { UserKey } from './UserKey';
import { CoinInfo } from './CoinInfo';
import { CoinHeader } from './CoinHeader';

const App: React.FC = () => {
  const priceWS = useRef<WebSocket | null>(null);
  const sortBy = useRef("cd");
  const sortOrder = useRef(false); // false: inc, true: dec
  const [ tickers, setTickers ] = useState({data: Map<string, Map<string, any>>()});
  // TODO: 빌트인 Array가 더 빠를줄 알았는데 List가 더 빠른 느낌... 정확한 확인 필요
  const [ ordered, setOrdered ] = useState({data: List<string>()});

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
        const parsed = JSON.parse(result);
        setTickers(prevTickers => {
          if (prevTickers.data.has(parsed.cd)) {
            return { data: prevTickers.data.mergeDeepIn([parsed.cd], parsed) };
          } else {
            return { data: prevTickers.data.set(parsed.cd, Map(parsed)) };
          }
        });
        setOrdered(prevOrdered => {
          if (!prevOrdered.data.includes(parsed.cd)) {
            return {data: prevOrdered.data.push(parsed.cd)};
          } else {
            return prevOrdered;
          }
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

  const updateSort = (newSortBy: string) => {
    if (sortBy.current === newSortBy) {
      sortOrder.current = !sortOrder.current;
    } else {
      sortBy.current = newSortBy;
      sortOrder.current = false;
    }

    setOrdered(prevOrdered => {
      return { data: prevOrdered.data.sort((a: string, b: string) => {
        let result;

        if (sortBy.current === "cd") {
          result = -a.localeCompare(b);
        } else {
          result = tickers.data.get(a)?.get(sortBy.current) - tickers.data.get(b)?.get(sortBy.current);
        }

        if (sortOrder.current === true) {
          return result;
        } else {
          return -result;
        }
      }) };
    });
  }

  return (
    <div className="flex justify-center">
      {/* main body */}
      <div className="mt-10 w-screen max-w-screen-lg">
        <div className="flex flex-col space-y-3 m-10">
          <div className="ml-3 mb-2 font-bold text-2xl">업비트 유틸리티</div>
          <UserKey connect={apiConnection}></UserKey>
          <CoinHeader sortBy={sortBy.current} updateSort={updateSort}></CoinHeader>
          {ordered.data.map((id: string) => (<CoinInfo key={id} id={id} data={tickers.data.get(id)}></CoinInfo>))}
        </div>
      </div>
    </div>
  );
}

export default App;
