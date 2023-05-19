import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://apn1-adequate-rodent-35404.upstash.io",
  token:
    "AYpMACQgMWE5YmVmM2EtMjE1OS00N2QwLTg4YjMtMThhNmE3ZDA2OTI2OTlkODE1NjJmMjNmNGE2NmE5MGExMGFjZmY1NzMxMmM=",
});

console.log("connected to redis");
