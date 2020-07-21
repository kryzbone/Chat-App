import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Join() {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('')

    console.log(name)


    return (
        <div className="join-container">
            <div className="join-box">
            <h1>JOIN</h1>
           
            <input type="text" placeholder="Enter Name..." onChange={(e) => setName(e.target.value)} />
            <textarea type="text" rows="5" placeholder="Enter Bio..." onChange={(e) => setBio(e.target.value)} />
            
            <Link onClick={(e)=> (!name || !bio)? e.preventDefault() : null } to={`/chat?name=${name}&bio=${bio}`}>
            <button>Join</button>
            </Link>
            </div>
        </div>
    )
}
