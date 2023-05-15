import type { ObjectId } from "mongoose";

interface Participant{
    key:ObjectId;
    username:string;
    imageUrl:string;
    admin:boolean;
}