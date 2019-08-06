import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {



  private authStatusSubs : Subscription ;
  private isLoading = false ;

  constructor(public authService: AuthService) { }

  ngOnInit() {
   this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
     authStatus => {
       this.isLoading = false ;
     }
   );
  }


  onSignup(form:NgForm) {
   // console.log(form.value);
    if(form.invalid) return ;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe(); 
  }

}
