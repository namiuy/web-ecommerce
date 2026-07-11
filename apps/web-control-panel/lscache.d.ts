declare module 'lscache' {
  const lscache: {
    set(key: string, value: any, time?: number): void;
    get(key: string): any;
    remove(key: string): void;
    flush(): void;
    flushExpired(): void;
  };
  export default lscache;
}

declare module 'deep-extend' {
  function deepExtend<T>(...args: any[]): T;
  export default deepExtend;
}
