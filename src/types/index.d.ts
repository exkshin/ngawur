export {};

declare global {
  interface Window {
    flutter_inappwebview: any;
  }
  declare module "*.json" {
    const value: any;
    export default value;
  }
}