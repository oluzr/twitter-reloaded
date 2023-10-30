import {
  collection,
  //getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../routes/firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface iTweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 10px;
`;
const Timeline = () => {
  const [tweets, setTweets] = useState<iTweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      /*     const snapshot = await getDocs(tweetsQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, username, userId, photo } = doc.data();
        return {
          id: doc.id,
          photo,
          tweet,
          userId,
          username,
          createdAt,
        };
      }); */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, username, userId, photo } = doc.data();
          return {
            id: doc.id,
            photo,
            tweet,
            userId,
            username,
            createdAt,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default Timeline;
