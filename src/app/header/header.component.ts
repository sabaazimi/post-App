import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false ;
  private authListenSubs: Subscription;
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.isAuth();
    this.authListenSubs = this.authService.getAuthStatusListener()
      .subscribe( isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated ;

      })
  }

  onLogout(){
    this.authService.logout();
  }


  ngOnDestroy(){
    this.authListenSubs.unsubscribe();
  }
}
