import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "./firebase";
import { styled } from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { iTweet } from "../components/timeline";
import Tweet from "../components/tweet";
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
  background-color: #fff;
`;
const UserNav = styled.div`
  padding-top: 20px;
  display: flex;
  gap: 20px 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 60px 0 #eeeeeea0;
  width: 100%;
  padding-bottom: 50px;
  @media only screen and (max-width: 600px) {
    padding-bottom: 15px;
    gap: 5px 0;
  }
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: 100%;
    fill: #ccc;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;

const Tweets = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
`;
const UserNameArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px 0;
  flex-direction: column;
  justify-content: center;
  @media only screen and (max-width: 600px) {
    gap:5px 0;
  }
`;
const Name = styled.input`
  border: 1px solid #f6f6f6;
  background-color: #f9f9f9;
  font-size: 22px;
  text-align: center;
  padding: 10px 0;
  width: auto;
  border-radius: 10px;

  &[readOnly] {
    cursor: default;
    outline: none;
    background: none;
    border: none;
  }
`;
const ModifyNameBtn = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.1s;
  &:hover {
    opacity: 1;
  }
  svg {
    fill: tomato;
    width: 100%;
    display: block;
  }
`;
const Profile = () => {
  const [tweets, setTweets] = useState<iTweet[]>([]);
  const [modifyMode, setModifyMode] = useState(false);
  const user = auth.currentUser;
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(user?.displayName ?? "Annoymous");
  const [avatar, setAvatar] = useState(user?.photoURL);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const onNameModify = async () => {
    if (!user) return;
    try {
      await updateProfile(user, {
        displayName: name,
      });
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25),
        where("userId", "==", user?.uid)
      );
      const snapshot = await getDocs(tweetsQuery);
      snapshot.docs.map((docitem) => {
        const ref = doc(db, "tweets", docitem.id);
        updateDoc(ref, {
          username: name,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      limit(25),
      where("userId", "==", user?.uid)
    );
    const snapshot = await getDocs(tweetsQuery);
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
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <UserNav>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          onChange={onAvatarChange}
          id="avatar"
          type="file"
          accept="image/*"
        />
        <UserNameArea>
          <Name
            type="text"
            maxLength={40}
            readOnly={!modifyMode}
            onChange={onNameChange}
            value={name}
            ref={nameInputRef}
          ></Name>
          {modifyMode ? (
            <ModifyNameBtn
              onClick={() => {
                setModifyMode((prev) => !prev);
                onNameModify();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </ModifyNameBtn>
          ) : (
            <ModifyNameBtn
              onClick={() => {
                setModifyMode((prev) => !prev);
                nameInputRef.current?.focus();
                console.log(nameInputRef.current);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </ModifyNameBtn>
          )}
        </UserNameArea>
      </UserNav>
      <Tweets>
        {" "}
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
};

export default Profile;
