import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { chatPost, chatForChannel } from "../../store/chats"
import { deleteChat } from "../../store/chats";
import './index.css';

let socket = io('http://127.0.0.1:5000/');

const Chat = ({ server, channels }) => {
    const [chatInput, setChatInput] = useState("");
    const [channel, setChannel] = useState()
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    let chats = useSelector(state => state.chats)
    const { channelId } = useParams();

    //Auto scroll feature
    const divRef = useRef(null);

    useEffect(() => {
        if (channel) {
        }
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    // useEffect(() => {
    //     // render the chat messages on the selected channel
    //     if (channelId) {
    //         dispatch(chatForChannel(channelId))
    //     }
    // }, [dispatch, channelId])

    useEffect(() => {
        console.log('HIT----')
        // render the chat messages on the selected channel
        if (channelId) {
            dispatch(chatForChannel(channelId))

            console.log('socket: ', socket)
            if (socket.disconnected) {
                console.log('reconnect---')
                socket = io('http://127.0.0.1:5000/');
            }

            // listen for chat messages from the server
            socket.on("chat", (data) => {
                // unmount if channel ids do not match
                // render incoming chat message only in the correct channel
                console.log('CHAT-----: ', data, channelId);
                console.log(data?.chat.channel_id == channelId)
                if (data?.chat.channel_id == channelId) {
                    dispatch(chatPost(data))
                }
            })
        }
        return (() => {
                console.log('unmount------')
                socket.disconnect()
        })
    }, [channelId])

    const sendChat = async (e) => {
        e.preventDefault()
        socket.emit("chat", { user, chat: chatInput, channel_id: channelId });
        // dispatch(chatPost(channelId, chatInput))
        setChatInput("")
    }

    const handleDeleteChat = (e, { id }) => {
        e.preventDefault();
        dispatch(deleteChat(id));
    }

    const ShowChats = () => {
        return chats?.map((chat) => {
            const isSessionUser = chat.owner_id === user.id;
            return (
                <div id="previousMessages" key={chat.id}>
                    <div className={isSessionUser ? "chat_user-active" : "Chat_user"}>
                        {chat.user.username}
                        {server.owner_id === chat.user.id && (
                            <small id="admin-small-text">server admin</small>
                        )}
                        {isSessionUser && (
                            <button id="btn-delete-chat" type="button" onClick={(e) => handleDeleteChat(e, chat)}>delete</button>
                        )}
                    </div>
                    <div id="Chat_message">{chat.content}</div>
                </div>
            );
        })
    }

    return (user && (
        <>
            <div >
                <ShowChats />
                <div ref={divRef} />
            </div>
            {channelId && (
                <form id="chat-form" method="POST" onSubmit={sendChat}>
                    <div id="chat-container">
                        <input
                            type="text"
                            placeholder="Message"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            required
                            maxLength={500}
                        />
                        <button type="submit">
                            <i className="far fa-paper-plane"></i>
                        </button>
                    </div>
                </form>
            )}
        </>
    )
    )
};


export default Chat;
