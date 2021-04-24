import React, { useEffect, useState, useRef } from 'react';
import { Map, List } from 'immutable'
import './App.css';
import { UserKey } from './UserKey';
import { CoinInfo } from './CoinInfo';
import { CoinHeader } from './CoinHeader';
import * as CoinMeta from './CoinMeta';

const App: React.FC = () => {
  const wsPrice = useRef<WebSocket | null>(null);
  const sortDelay = useRef(false); // true: ready to update
  const sortBy = useRef("cd");
  const sortOrder = useRef(false); // false: inc, true: dec
  const willUpdate = useRef<number>(0); // index of a market will be updated in unsorted
  const unsorted = useRef<string[]>([]);
  const [ tickers, setTickers ] = useState({data: Map<string, Map<string, any>>()});
  // TODO: 빌트인 Array가 더 빠를줄 알았는데 List가 더 빠른 느낌... 정확한 확인 필요
  const [ sorted, setSorted ] = useState({data: List<string>()});

  useEffect(() => {
    wsPrice.current = new WebSocket("wss://api.upbit.com/websocket/v1");

    wsPrice.current.onopen = () => {
      console.log("price websocket connected.");
      wsPrice.current?.send(`[{"ticket":"opening"},{"type":"ticker","codes":
                            ${JSON.stringify(CoinMeta.codes)}, "isOnlySnapshot":"true"},
                            {"format":"SIMPLE"}]`);
    }

    wsPrice.current.onmessage = (e: MessageEvent) => {
      e.data.text().then((result: string) => {
        const parsed = JSON.parse(result);
        setTickers(prevTickers => {
          if (prevTickers.data.has(parsed.cd)) {
            return { data: prevTickers.data.mergeDeepIn([parsed.cd], parsed) };
          } else {
            return {
              data: prevTickers.data.set(parsed.cd, Map(parsed))
              .setIn([parsed.cd, "candle"], Map({
                "5m": [], "15m": [], "30m": [], "1h": [], "4h": [], "1d": []
              })).setIn([parsed.cd, "indicator"], Map({
                "rsi": 0, 
              }))
            };
          }
        });
        if (!unsorted.current.includes(parsed.cd)) {
          unsorted.current.push(parsed.cd);
          setSorted(prevSorted => {
            if (!prevSorted.data.includes(parsed.cd)) {
              return {data: prevSorted.data.push(parsed.cd)};
            } else {
              return prevSorted;
            }
          });
        }
      });
    };

    const candleInterval = setInterval(() => {
      if (unsorted.current.length === willUpdate.current) {
        willUpdate.current -= unsorted.current.length;
      } else {
        const candleURL = "https://api.upbit.com/v1/candles/";
        fetch(candleURL + `minutes/5?market=${unsorted.current[willUpdate.current]}&count=100`)
        .then((response) => {
          response.json().then((parsed) => {
            setTickers(prevTickers => { return {
              data: prevTickers.data.setIn([unsorted.current[willUpdate.current], "candle", "5m"], parsed)
            }});
          })
        }).catch(e => console.log(e));
        fetch(candleURL + `minutes/15?market=${unsorted.current[willUpdate.current]}&count=100`)
        .then((response) => {
          response.json().then((parsed) => {
            setTickers(prevTickers => { return {
              data: prevTickers.data.setIn([unsorted.current[willUpdate.current], "candle", "15m"], parsed)
            }});
          })
        }).catch(e => console.log(e));
        fetch(candleURL + `minutes/30?market=${unsorted.current[willUpdate.current]}&count=100`)
        .then((response) => {
          response.json().then((parsed) => {
            setTickers(prevTickers => { return {
              data: prevTickers.data.setIn([unsorted.current[willUpdate.current], "candle", "30m"], parsed)
            }});
          })
        }).catch(e => console.log(e));
        fetch(candleURL + `minutes/60?market=${unsorted.current[willUpdate.current]}&count=100`)
        .then((response) => {
          response.json().then((parsed) => {
            setTickers(prevTickers => { return {
              data: prevTickers.data.setIn([unsorted.current[willUpdate.current], "candle", "1h"], parsed)
            }});
          })
        }).catch(e => console.log(e));
        fetch(candleURL + `minutes/240?market=${unsorted.current[willUpdate.current]}&count=100`)
        .then((response) => {
          response.json().then((parsed) => {
            setTickers(prevTickers => { return {
              data: prevTickers.data.setIn([unsorted.current[willUpdate.current], "candle", "4h"], parsed)
            }});
          })
        }).catch(e => console.log(e));
        fetch(candleURL + `days?market=${unsorted.current[willUpdate.current]}&count=100`)
        .then((response) => {
          response.json().then((parsed) => {
            setTickers(prevTickers => { return {
              data: prevTickers.data.setIn([unsorted.current[willUpdate.current], "candle", "1d"], parsed)
            }});
          })
        }).catch(e => console.log(e));
        console.log("update " + unsorted.current[willUpdate.current]);
        willUpdate.current += 1;
      }
    }, 1000);

    const tickerInterval = setInterval(() => {
      wsPrice.current?.send(`[{"ticket":"updating"},{"type":"ticker","codes":
                            ${JSON.stringify(CoinMeta.codes)}, "isOnlySnapshot":"true"},
                            {"format":"SIMPLE"}]`);
      console.log("get tickers")
      sortDelay.current = true;
    }, 5000);

    return () => {
      wsPrice.current?.close();
      clearInterval(candleInterval);
      clearInterval(tickerInterval);
    }
  }, []);

  useEffect(() => {
    if (sortDelay.current === true) {
      refreshSort();
    }
  }, [tickers]);

  const apiConnection = (accessKey: string, secretKey: string) => {
    console.log(accessKey);
    console.log(secretKey);
  };

  const refreshSort = () => {
    setSorted(prevSorted => {
      return { data: prevSorted.data.sort((a: string, b: string) => {
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

  const updateSort = (newSortBy: string) => {
    if (sortBy.current === newSortBy) {
      sortOrder.current = !sortOrder.current;
    } else {
      sortBy.current = newSortBy;
      sortOrder.current = false;
    }

    refreshSort();
  }

  return (
    <div className="flex justify-center">
      {/* main body */}
      <div className="mt-10 w-screen max-w-screen-lg">
        <div className="flex flex-col space-y-3 m-10">
          <div className="ml-3 mb-2 font-bold text-2xl">업비트 유틸리티</div>
          <UserKey connect={apiConnection}></UserKey>
          <CoinHeader sortBy={sortBy.current} updateSort={updateSort}></CoinHeader>
          {sorted.data.map((id: string) => (<CoinInfo key={id} id={id} data={tickers.data?.get(id)}></CoinInfo>))}
        </div>
      </div>
    </div>
  );
}

export default App;
