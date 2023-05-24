import type { ObjectId } from "mongoose";

interface participant{
    key:ObjectId;
    username:string;
    imageUrl:string;
    admin:boolean;
}