import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../Services/chat.service';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css'
})
export class JoinRoomComponent implements OnInit{
joinRoomForm!:FormGroup;

constructor(private formBuilder:FormBuilder , private router:Router ,private chatService:ChatService) {}
ngOnInit(): void {
  this.joinRoomForm=this.formBuilder.group({
    user:['',Validators.required],
    room:['',Validators.required]
  })
}

joinRoom(){
 
let {user,room}=this.joinRoomForm.value;
this.chatService.joinRoom(user,room).then(()=>{
  this.router.navigate(['chat']);
}).catch((err)=>{
  console.log(err);
})
sessionStorage.setItem("user",user);
sessionStorage.setItem("room",room);

}


}
