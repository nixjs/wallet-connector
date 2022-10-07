import { Axios } from "axios";

export namespace TronTypes {
  export interface FullNode {
    chainType: number;
    headers: any;
    host: string;
    instance: Axios;
    password: boolean;
    queue: any[];
    ready: boolean;
    statusPage: string;
    timeout: number;
    user: boolean;
  }
}
