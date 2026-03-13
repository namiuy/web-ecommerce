declare module 'lscache' {
  interface LSCache {
    set(key: string, value: any, time?: number): void;
    get(key: string): any;
    remove(key: string): void;
    flush(): void;
    flushExpired(): void;
    setBucket(bucket: string): void;
    resetBucket(): void;
    enableWarnings(enabled: boolean): void;
    supported(): boolean;
  }

  const lscache: LSCache;
  export default lscache;
}
