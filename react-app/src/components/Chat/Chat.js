import React, { useState, useRef, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { chatPost, chatForChannel } from "../../store/chats"
import { deleteChat } from "../../store/chats";
import './index.css';
let socket;

const Chat = ({ server, channels }) => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState()
    const [messagePosted, setMessagePosted] = useState(false)
    const [content, setContent] = useState('')
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

    useEffect(() => {
        // render the chat messages on the selected channel
        if (channelId) {
            dispatch(chatForChannel(channelId))
        }
    }, [dispatch, channelId])

    useEffect(() => {

        socket = io();

        socket.on("chat", (chat) => {
            setMessages(messages => [...messages, chat])
        })

        return (() => {
            socket.disconnect()
        })

    }, [chats])

    // const updateChannel = (e) => {
    //     setChannel(e.target.value)
    // }

    const sendChat = async (e) => {
        e.preventDefault()
        // socket.emit("chat_to_channel", {
        //     channel_id: channel.id,
        //     body: content
        // })
        socket.emit("chat", { user: user.username, msg: chatInput });
        setChatInput("")
        setMessagePosted(true)
        await dispatch(chatPost(channelId, chatInput))
    }

    const handleDeleteChat = (e, {id}) => {
        e.preventDefault();
        dispatch(deleteChat(id));
    }

    const ShowChats = () => {
            return chats?.map((chat) => {
                return (
                    <div id="previousMessages" key={chat.id}>
                        <div id="Chat_user">
                            {chat.user.username}
                            {server.owner_id === chat.user.id && (
                                <small id="admin-small-text">server admin</small>
                            )}
                            {chat.owner_id === user.id && (
                                <button id="btn-delete-chat" type="button" onClick={(e) => handleDeleteChat(e, chat)}>delete</button>
                            )}
                        </div>
                        <div id="Chat_message">{chat.content}</div>
                    </div>
                );
            })
    }

    // const place = show ? chats?.map((msg) => {
    //     return (
    //         <div id="previousMessages" key={msg.id}>
    //             <div id="Chat_user">{user.username}</div>
    //             <div id="Chat_message">{msg.content}</div>
    //         </div>
    //     );
    // }) : <div></div>


    // const messagesForChannel = async () => {
    //     // console.log("This is a test")
    //     await dispatch(chatForChannel(channel))
    //     setShow(true)
    // }

    return (user && (
        <>
            {/* <div id="channelTest">
                <input
                    placeholder="Select Channel"
                    value={channel}
                    onChange={updateChannel}
                />
                <button onClick={messagesForChannel}> Channel {channel}</button>
            </div> */}
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

/*

 {messages.map((message, ind) => (
                    <div key={ind} id="messageComponent">
                        {// <div id="RecentMessage">Most Recent Message From you</div> }
                        <div id="Chat_user" key={ind}>{`${message.user}`}</div>
                        <div id="another">
                            <div id="Chat_message" key={ind}>{` ${message.msg} `}</div>
                        </div>
                    </div>
                ))}

*/
