import React from 'react'

function Message(props) {
    const currentUser = props.text.user === props.cu;
    const gen = props.gen

    const align = currentUser? 'message-container user' : 'message-container';
    const bg = currentUser? 'message user' : 'message';

    

    return (
        <div className={align} >
            <div className={bg}>
                <span className="meta">
                    { gen && !currentUser? props.text.user + ':' : null}
                </span>

                <div className="msg">
                    {props.text.msg}
                </div>
            </div> 
            
        </div>
    )
}

export default Message
