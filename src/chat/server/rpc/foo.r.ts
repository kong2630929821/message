import { FooRpc as FooRpcReq, FooRpcResp } from '../rpc/foo.s';

//#[rpc]
export const FooRpc = (fooRpcReq: FooRpcReq): FooRpcResp => {
    let f = new FooRpcResp();
    f.name = "fbj";
    f.age = 12;

    return f;
}
