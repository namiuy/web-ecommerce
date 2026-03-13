declare module 'deep-extend' {
  function deepExtend<T = any>(target: T, ...sources: any[]): T;
  export = deepExtend;
}
