class Users{
    constructor(){
        this.users = []
    }

    AddUserData(id,name,room,channelId){
        //destructring is used for same name of object and parameters
        var users = {id, name, room,channelId}
        this.users.push(users)
        return users;
    }

    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user)=> user.id !== id);
        }
        return user;
    }

    GetUser(id){
        var getUser = this.users.filter((userId)=>{
            return userId.id === id
        })[0];
        return getUser;
    }

    GetUsersList(room){
        var users = this.users.filter((user)=> user.room === room) //ES6 short hand method for returning sth

        var namesArray = users.map((user) => user.name);
        return namesArray;
    }

}

module.exports = {Users};