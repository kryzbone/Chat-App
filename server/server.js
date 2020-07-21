const { disconnect } = require('process');

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Port = process.env.PORT || 5000;

let randomUsers = []
const chatBot ='ChatBot';
const gen = 'gen', ran = 'ran';
const { addUser, removeUser, getUser, users } = require('./users.js');
let user;



//get Random User
const getRandomUser = (n,m) => {
    let i = randomUsers.filter(ran => ran.connected === false && ran.id !== n && ran.id !== m), 
        r = Math.floor(Math.random() * i.length);


    if(i.length) {
        let f = i[r].id
        return randomUsers.find(itm => itm.id === f)
    }  else return null
}   


app.get('/', (req, res) => {
    res.send('helloooo...')
})


io.on('connection', (socket) => {
    console.log('New socket Connected', socket.id);
    
    socket.on('join', ({name, bio})=> {
        console.log(`${name} just joined chat. Bio: ${bio}`);
    
        addUser(socket.id, name, bio);
        socket.emit('welcome', { msg:`Welcome to General chat ${name}` });
        socket.broadcast.emit('chat', {user: chatBot, msg:`${name} just joined the chat`} );
        io.emit('update', { users })
    })

    //handling typing notice
    socket.on('typin', ({msg, id, cat}) => {
        if(cat === gen) {
            console.log(gen);
            socket.broadcast.emit('type', {msg} );
            setTimeout(()=> {
                socket.broadcast.emit('type', {msg:''} );
            },2000)
        }else {
            if(id) {
                io.to(id).emit('type', {msg});
                setTimeout(()=> {
                    socket.broadcast.emit('type', {msg:''} );
                },2000)
            } 
        }
    })

    //handling random request
    socket.on('join-random', ({name, bio})=> {
        randomUsers.push({name, bio, connected: false, id: socket.id})
    })

    socket.on('close-random', ({name})=> {
        randomUsers= randomUsers.filter(random => random.name !== name)
    })

    socket.on('request', ( ranChatErr ) => {
       
        //get current user and last user index
        let current = randomUsers.find(random =>  random.id === socket.id)
        let last = randomUsers.find(random =>  random.id === current.prev)

        if(!current) return
        console.log('current ' + current.name, 'last ' + current.prev);
        
        //reset cuurent & last user connection status
        current.connected = false
        if(last) {
            if(last.prev === current.id) {
                last.connected = false
                io.to(last.id).emit('ran-chat', {error: 'click scan'})
            }
        }

        //get free user index
        let free = getRandomUser(socket.id, current.prev)
        

        //match current and free users
        if(free) {
            console.log('runnin 1', free)
            current.connected = free.connected = true
            current.prev = free.id
            free.prev = current.id
            

            //message to free user
            io.to(free.id).emit('ran-chat', current)

            //message to current user 
            socket.emit('ran-chat', free)
               
        } else{
            socket.emit('ran-chat', {error: 'loadin'})
            setTimeout(() => {
                current.connected === false? ranChatErr() : null 
            }, 10000)
        }  
         
        console.log(randomUsers);
    })


    //handling random chat messges
    socket.on('ran-chat', ({ name, msg, id}) => {
        io.to(id).emit('ran-msg', {user: name, msg: msg})
    })


     //handling messages sent   
    socket.on('send', ({name, msg}) => {
        io.emit('chat', {user: name, msg: msg})
    })

    socket.on('disconnect', ()=> {
        console.log('socket disconnected')
        randomUsers= randomUsers.filter(random => random.id !== socket.id)
        user = removeUser(socket.id)
        if(!user) return
        socket.broadcast.emit('logout', { users, user: chatBot,  msg:`${user.name} left the chat` });
    })
})


server.listen(Port, () => {
    console.log(`Server is listening on port ${Port}`)
})