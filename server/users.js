const users = [];

const addUser = ( id, name, bio ) => {
    const username = name.trim().toLowerCase();

    const taken = users.find(user => user.name == username)

    if (taken) {
        return { error: 'Name already exist'}
    }

    const user = { id, name: username, bio}
    users.push(user);

    return user;
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id == id);

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find(user => user.id == id)  



const UsersInRoom = () => {

}


module.exports = { addUser, removeUser, getUser,  users }