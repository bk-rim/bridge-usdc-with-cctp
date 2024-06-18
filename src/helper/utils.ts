import {  Registry, GeneratedType } from "@cosmjs/proto-signing";
import { MsgDepositForBurnWithCaller } from "./tx"


const cctpTypes: ReadonlyArray<[string, GeneratedType]> = [
    ["/circle.cctp.v1.MsgDepositForBurnWithCaller", MsgDepositForBurnWithCaller],
  ];
  
export  function createDefaultRegistry(): Registry {
    return new Registry(cctpTypes)
  };