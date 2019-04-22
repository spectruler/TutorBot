class Global{
    constructor(){
        this.globalRoom = []
    }

    EnterRoom(id,name,room){ //if user has image add here
        //destructring is used for same name of object and parameters
        var roomName = {id, name, room}
        this.globalRoom.push(roomName)
        return roomName;
    }


    // EnterRoom(id,name,room,img){ //if user has image add here
    //     //destructring is used for same name of object and parameters
    //     var roomName = {id, name, room,img}
    //     this.globalRoom.push(roomName)
    //     return roomName;
    // }


    GetRoomList(room){
        var roomName = this.globalRoom.filter((user)=> user.room === room) //ES6 short hand method for returning sth

        var namesArray = roomName.map((user) => {
            return {
                name: user.name,
            }
        });
        return namesArray;
    }

    // GetRoomList(room){
    //     var roomName = this.globalRoom.filter((user)=> user.room === room) //ES6 short hand method for returning sth

    //     var namesArray = roomName.map((user) => {
    //         return {
    //             name: user.username,
    //             img: user.img
    //         }
    //     });
    //     return namesArray;
    // }

    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.globalRoom.filter((user)=> user.id !== id);
        }
        return user;
    }

    GetUser(id){
        var getUser = this.globalRoom.filter((userId)=>{
            return userId.id === id
        })[0];
        return getUser;
    }

}

module.exports = {Global};