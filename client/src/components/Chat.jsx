import React,  { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import queryString from 'query-string';
import io from 'socket.io-client'
import Messages from './Messages';


let socket;
const chatBot ='ChatBot';


function Chat({ location }) {
    const [chatRoom, setChatRoom] = useState('General'),
          [ranUser, setRanUser] = useState('Click on Scan'),
          [status, setStatus]  = useState('status'),
          [welcome, setWelcome] = useState(''),
          [name, setName] = useState(''),
          [bio, setBio] = useState(''),
          [type, setType] = useState(''),
          [messages, setMessages] = useState([]),
          [totalUsers, setTotalUsers] = useState([]),
          [randomChat, setRandomChat] = useState([]),
          [randomData, setRandomData] = useState({})
    
    const server = 'https://chat-app-react.glitch.me/';
    
   
    useEffect(() => {
        //get login Info from URL
        const {name , bio} = queryString.parse(location.search)

        setName(name);
        setBio(bio);

        socket = io(server);

        socket.on('connect', () =>{
            setStatus('status online');
            socket.emit('join', {name, bio})
        })

        socket.on('welcome', ( msg ) => {
            setWelcome(msg)
            // updateMsg({user, msg})    
        })

        socket.on('update', ({users}) => {
            setTotalUsers([ ...users ])
        })

        socket.on('logout', ({ users, user, msg}) => {
            updateMsg({user, msg})
            setTotalUsers([ ...users ])
        })

        socket.on('chat', ({user, msg}) => {
            updateMsg({user, msg})    
        })

        socket.on('ran-chat', (data) => {
            if(data) {
                setRandomData(data)
                setRanUser(data.name || data.error)
            } 
        })

        socket.on('ran-msg', (data) => {
           setRandomChat((prev) => [...prev, data])
        })

        socket.on('type', ({msg})=> {
            setType(msg)
        })

        socket.on('disconnect', () => {
            console.log('client disconect')
            socket.close()
            updateMsg({user: chatBot, msg:`Refresh Page`})
            setStatus('status');  
        })

    }, [server, location.search])



    useEffect(() => {
        if(chatRoom === 'Random') {
            socket.emit('join-random', {name, bio})
            
        }else {
            socket.emit('close-random', {name, bio})
        }

    },[chatRoom])

    
    //Generate Random User
    function handleChat() {
        chatRoom === 'General'? setChatRoom('Random') : setChatRoom('General');
        // let ranNum = Math.floor(Math.random() * totalUsers.length)
    }


    //handle random chat errors
    function ranChatErr() {
        socket.emit('request', ranChatErr)
    }


    //handle scan 
    function handleScan() {
        socket.emit('request', ranChatErr)
    }


    //update messages
    function updateMsg(obj) {
        setMessages((prev) => {
            return [...prev, obj]
        })
    }

    // sending message
    const sendMsg = (e) => {
        e.preventDefault();
        const msg = e.target.children[0].value
        const data = { user: name, msg}
        chatRoom === 'General'? socket.emit('send', {name, msg}) : socket.emit('ran-chat', {name, msg, id: randomData.id});

        if(chatRoom === 'Random') setRandomChat((prev) => [...prev, data])

        //clear msg field
        e.target.children[0].value = '';
    }

    // typing notice
    function typing() {
        const gen = 'gen', ran = 'ran';
        chatRoom === 'General'? socket.emit('typin', { msg:`${name} typing....`, cat: gen}) : socket.emit('typin', {msg:'typing...', id: randomData.id, cat:ran});
        
    }


    if(chatRoom === 'General') {
        return (
            <div className="chat-container">
                <div className="chat-box"> 
    
                    <div className="chat-header">
                        <div className="chat-room">
                            <span className={status}></span>
                             General
                        </div>
                        <div className="type"> {type} </div>
                       <a href="/"> <div>x</div> </a>
                    </div>
    
                    <ScrollToBottom>
                        <Messages text={messages} name={name} intro={welcome} gen={true} />
                    </ScrollToBottom>
    
                    <form className="chat-form" onSubmit={(e) => sendMsg(e)} >
                        <input type="text"  placeholder="Send Message..." autoFocus onChange={typing} />
                        <button type="submit" >Send</button>
                    </form>
                </div>
    
                <div className="user-box">
                    <span> Online Users {totalUsers.length} </span> 
                    <div className="random-list">
    
                    </div>
                    <button className="btn" onClick={handleChat}>Random Chat</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="chat-container">
                <div className="chat-box"> 
    
                    <div className="chat-header">
                        <div className="chat-room">
                            <span className={status}></span>
                            Random
                        </div>
                        <div>{ranUser} <div className="type" > {type} </div></div>
                        <button className="skip" onClick={handleScan}>Scan</button>
                    </div>
    
                    <ScrollToBottom>
                        <Messages text={randomChat} name={name} intro={{msg: randomData.bio}} gen={false} />
                    </ScrollToBottom>
    
                    <form className="chat-form" onSubmit={(e) => sendMsg(e)} >
                        <input type="text"  placeholder="Send Message..." autoFocus onChange={typing} />
                        <button type="submit" >Send</button>
                    </form>
                </div>
    
                <div className="user-box">
                    <span> Online Users {totalUsers.length} </span> 
                    <div className="random-list">
    
                    </div>
                    <button className="btn" onClick={handleChat}>General Chat</button>
                </div>
            </div>
        )
    }
}

export default Chat
