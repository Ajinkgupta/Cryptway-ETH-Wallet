/// <reference types="react-scripts" />
interface Window {
    ethereum: CWProvider
}

declare module '*.png' {
    const value: any;
    export default value;
  }

  declare module '*.jpeg' {
    const value: any;
    export default value;
  }

  declare module '*.gif' {
    const value: any;
    export default value;
  }