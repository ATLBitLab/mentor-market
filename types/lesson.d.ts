import { Event } from "nostr-tools";

export type Lesson = {
    title: string;
    description: string;
    imageUrl?: string;
    price: number;
    event?: Event
} 