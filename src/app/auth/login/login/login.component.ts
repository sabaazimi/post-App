import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authStatusSubs : Subscription ;
  

  isLoading = false;
  onLogin(form:NgForm){
    //console.log(form.value);
    if (form.invalid) return;
    this.authService.login(form.value.email, form.value.password);

  }

  
  constructor(public authService: AuthService) { }


  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false ;
      }
    );
   }
 
   ngOnDestroy(){
    this.authStatusSubs.unsubscribe(); 
  }
}
