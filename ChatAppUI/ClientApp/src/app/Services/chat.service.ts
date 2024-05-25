import { Injectable } from '@angular/core';
// import signalR, { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5202/ChatHub")
  .configureLogging(signalR.LogLevel.Information)
  .build();


public messages$=new BehaviorSubject<any>([]);
public connectedUsers$=new BehaviorSubject<string[]>([]);
public messages:any[]=[];
public users:string[]=[]
  constructor() { 
    this.start();
    this.connection.on("ReceivedMessage",(user:string,message:string,messageTime:string) =>{
      console.log("User:",user);
      console.log("Message :",message);
      console.log("Message Time :",messageTime);
      this.messages=[...this.messages,{user,message,messageTime}];
      this.messages$.next(this.messages)
    });

    this.connection.on("ConnectedUser",(users:any)=>{
      console.log("User",users)
      this.connectedUsers$.next(users);
    })
  }

//start connection
// public async Start(){
//   try{
// await this.connection.start();
// console.log("Connection is establish");
//   }catch (error){
// console.log(error);
// }}


public async start() {
  try {
    await this.connection.start();
    console.log("Connection is established");
  } catch (error) {
    console.error("Error starting SignalR connection:", error);
  }
}
//join room
public async joinRoom(user:string , room:string){
return this.connection.invoke("JoinRoom",{user,room})
}

//send message
public async sendMessage(message:string){
return this.connection.invoke("SendMessage",message);
}


//leave 
public async leaveChat(){
  return this.connection.stop();
}


}
