import { styled } from "styled-components";
import { iTweet } from "./timeline";
import { auth, db, storage } from "../routes/firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
const Wrapper = styled.div`
  @media only screen and (max-width: 600px) {
    padding: 15px 10px;
  }
  padding: 15px;
  border-top: 1px solid #efefef;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  &:first-child {
    border-top: none;
  }
`;
const Column = styled.div`
  display: flex;
  /* flex-direction: column; */
  /* justify-content: space-between; */
  gap: 10px;
  position: relative;
`;
const Avatar = styled.div`
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  svg {
    fill: #ccc;
    width: 40px;
  }
  img {
    display: inline-block;
    width: 100%;
  }
`;
const Username = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: #787878;
`;

const Photo = styled.img`
  width: 100%;

  border-radius: 10px;
  &.modifyMode {
    border: 1px solid #ccc;
    opacity: calc(0.6);
  }
`;
const AddPhoto = styled.label`
  flex-direction: column;
  border: 2px solid #f3f3f3;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 10px 0;
  &:has(svg.success) {
    color: tomato;
    border-color: tomato;
  }
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
    fill: #ccc;
    &.success {
      fill: tomato;
    }
  }
`;
const AddPhotoInput = styled.input`
  display: none;
`;
const UserButtonWrap = styled.div`
  justify-content: right;
  display: flex;
  align-items: center;
  gap: 0 5px;
`;
const DeleteButton = styled.button`
  
  background-color: #b7b7b7;
  color: #fff;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.1s;
  &:hover {
    transform: scale(1.05);
  }
  svg {
    fill: #fff;
    width: 100%;
  }
  padding: 4px;
  @media only screen and (max-width: 600px) {
  }
`;
const ModifyButton = styled.button`
    padding: 4px;
  @media only screen and (max-width: 600px) {
  }
  transition: all 0.1s;
  background-color: tomato;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  &:hover {
    transform: scale(1.05);
  }
  svg {
    fill: #fff;
    width: 100%;
  }
`;
const DeletePhoto = styled.div`
  position: absolute;
  background: tomato;
  width: 25px;
  z-index: 1;
  height: 25px;
  transition: all 0.1s;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  padding: 2px;
  justify-content: center;
  &:hover {
    transform: scale(1.05);
  }
  svg {
    width: 100%;
  }
`;
const Tweet = ({ username, photo, tweet, userId, id, createdAt }: iTweet) => {
  const [isLoading, setLoading] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [modifyMode, setModifyMode] = useState(false);
  const [myTweet, setMyTweet] = useState(tweet);
  const user = auth.currentUser;
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMyTweet(e.target.value);
  };
  const getAvatar = async () => {
    setLoading(false);
    try {
      setLoading(true);
      const locationRef = ref(storage, `avatars/${userId}`);
      console.log(locationRef);
      const avatarUrl = await getDownloadURL(locationRef);
      if (avatarUrl) {
        setAvatar(avatarUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAvatar();
  }, []);
  const onModify = async () => {
    if (user?.uid !== userId || isLoading) return;
    try {
      setLoading(true);
      if (newFile) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, newFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
          tweet: myTweet,
        });
      } else {
        const ref = doc(db, "tweets", id);
        await updateDoc(ref, {
          tweet: myTweet,
        });
      }
      setNewFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId || isLoading) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "tweets", id));
      if (photo !== undefined) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const onPhotoDelete = async () => {
    if (isLoading || user?.uid !== userId) return;
    try {
      setLoading(true);
      const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      await deleteObject(photoRef);
      await updateDoc(doc(db, "tweets", id), {
        photo: deleteField(),
      });
      setNewFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size <= 10 * 1024 * 1024) {
      setNewFile(files[0]);
    } else {
      alert("10MB 용량 이하의 이미지 파일 1개만 업로드 가능합니다");
    }
  };
  const date = new Date(createdAt);
  return (
    <Wrapper>
      <Column>
        <div>
          <Avatar>
            {avatar ? (
              <img src={avatar} />
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
          </Avatar>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            gap: "10px",
          }}
        >
          <Username>@{username}</Username>
          <TextareaAutosize
            maxLength={180}
            value={myTweet}
            ref={inputRef}
            readOnly={!modifyMode}
            onChange={onChange}
          />
          <span style={{ fontSize: '12px', color:'#888', textAlign:'right'}}>{ `${date.toLocaleString()}`}</span>
          {user?.uid === userId ? (
            <UserButtonWrap>
              {!modifyMode ? (
                <ModifyButton
                  onClick={() => {
                    setModifyMode((prev) => !prev);
                    inputRef.current?.focus();
                    console.log(inputRef.current);
                  }}
                >
                  <svg
                    xmlns="Wttp://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                  </svg>
                </ModifyButton>
              ) : (
                <ModifyButton
                  onClick={() => {
                    setModifyMode((prev) => !prev);
                    onModify();
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
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </ModifyButton>
              )}
              <DeleteButton onClick={onDelete}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </DeleteButton>
            </UserButtonWrap>
          ) : null}
        </div>
      </Column>

      {photo ? (
        <Column>
          {modifyMode && (
            <DeletePhoto
              onClick={() => {
                onPhotoDelete();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </DeletePhoto>
          )}
          <Photo className={modifyMode ? "modifyMode" : ""} src={photo} />
        </Column>
      ) : modifyMode ? (
        <>
          <AddPhoto htmlFor="addedPhoto">
            {newFile ? (
              <>
                <span>success!</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 success"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </AddPhoto>
          <AddPhotoInput
            id="addedPhoto"
            accept="image/*"
            type="file"
            onChange={onFileUpload}
          ></AddPhotoInput>
        </>
      ) : null}
    </Wrapper>
  );
};

export default Tweet;
