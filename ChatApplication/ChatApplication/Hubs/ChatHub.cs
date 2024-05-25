
using ChatApplication.Core;
using Microsoft.AspNetCore.SignalR;


namespace ChatApplication.Hubs
{
    public class ChatHub: Hub
    {
        private readonly IDictionary<string,UserRoomConnection> _connections;
        public ChatHub(IDictionary<string, UserRoomConnection> connections)
        {
            _connections = connections;
        }
        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room!);
            _connections[Context.ConnectionId] = userConnection;
            await Clients.Group(userConnection.Room!).
                SendAsync("ReceivedMessage","Lets Program Bot",$"{userConnection.User} has Joined the Group",DateTime.Now);
            await SendConnectedUser(userConnection.Room!);
        }

        public async Task SendMessage(string message)
        {
            if(_connections.TryGetValue(Context.ConnectionId,out UserRoomConnection userRoomConnection))
            {
                await Clients.Group(userRoomConnection.Room!).SendAsync("ReceivedMessage", 
                    userRoomConnection.User,message,DateTime.Now);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exp)
        {
           if(!_connections.TryGetValue(Context.ConnectionId,out UserRoomConnection roomConnection))
            {
                return base.OnDisconnectedAsync(exp);
            }
           _connections.Remove(Context.ConnectionId);
            Clients.Group(roomConnection.Room!).SendAsync("ReceivedMessage",
                "Lets Program Bot",$"{roomConnection.User} has Left the Group");
            SendConnectedUser(roomConnection.Room!);
            return base.OnDisconnectedAsync(exp);
        }

        public Task SendConnectedUser(string room)
        {
            var users = _connections.Values.Where(u => u.Room == room).Select(s => s.User);
            return Clients.Group(room).SendAsync("connectedUser",users);
        }




    }





}
