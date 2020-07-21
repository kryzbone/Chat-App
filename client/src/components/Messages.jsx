import React from 'react';
import Message from './Message';

function Messages(props) {
    return (
        <div className="message-box">
            <Welcome intro={props.intro} />
             {props.text.map((itm, i) => {
                 if(itm.user === 'ChatBot') {
                   return <Welcome key={i} intro={itm} />
                 } else return  <Message key={i} text={itm} cu={props.name} gen={props.gen} />
             })}
        </div> 
    )
}

function Welcome(props) {
    return (
        <div className="welcome">
            <div>
                {props.intro.msg}
            </div>
        </div>
    )
}

export default Messages
