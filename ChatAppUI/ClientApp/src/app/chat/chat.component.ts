import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { ChatService } from '../Services/chat.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';







@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,DatePipe,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit ,AfterViewChecked{
 messages:any[]=[];
 inputMessage="";
 loggedInUserName=sessionStorage.getItem("user");
 roomName = sessionStorage.getItem("room");
@ViewChild('scrollMe') private scrollContainer!:ElementRef;;
constructor(public chatService:ChatService , private router:Router){

}

ngOnInit(): void {
  this.chatService.messages$.subscribe(res =>{
    this.messages=res
    console.log(this.messages)
  });
}

sendMessage()
{
this.chatService.sendMessage(this.inputMessage)
.then(()=>{
  this.inputMessage ='';
}).catch((err)=>{
  console.log(err);
});
}

leaveChat(){
  this.chatService.leaveChat()
  .then(()=>{
    this.router.navigate(['welcome']);
    setTimeout(() => {
      location.reload();
    }, 0);
  }).catch((err)=>{
    console.log(err)
  })
}

ngAfterViewChecked(): void {
 this.scrollContainer.nativeElement.scrollTop =this.scrollContainer.nativeElement.scrollHeight;
}




}
