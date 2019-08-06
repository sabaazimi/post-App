import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = 'http://localhost:3000/api/user/signup' ;
  private token:string ;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false ;
  private userId: string;
  private tokenTimer: any ;


  isAuth(){
    return this.isAuthenticated ;
  }


  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getToken(){
    return this.token ;
  }


  getUserId(){
    return this.userId ;
  }

  constructor(private http:HttpClient, private route: Router) { }

  createUser(email:string, password:string){
    const authData: AuthData = {email : email, password: password};
    this.http.post(this.URL, authData)
    .subscribe( data => {
      console.log(data);
      this.route.navigate(['/login'])
    } , error => {
      this.authStatusListener.next(false);
    })
  }


  login(email:string, password:string){
    const authData: AuthData = {email : email, password: password};
    this.http.post<{token: string, expiresIn: number, userId:string}>('http://localhost:3000/api/user/login', authData)
      .subscribe((result) =>{
        console.log(result);
        const token = result.token;
        this.token = token;
        if(token) {
          const expireInDuration = result.expiresIn;
          this.setAuthTimer(expireInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = result.userId ;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireInDuration *1000);
          this.saveAuthData(token, expirationDate, this.userId);
          console.log(expirationDate);
          this.route.navigate(["/"]);
        }
        
      }, error => {
        this.authStatusListener.next(false);
      })
  }


  autoAuthUser(){
    const authInfo = this.getAuthData();
    
    if(!authInfo) return ;

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime() ;

    if( expiresIn > 0) {
      this.token = authInfo.token ;
      this.isAuthenticated = true ;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration : number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout(){
    this.token = null ;
    this.isAuthenticated = false ;
    this.authStatusListener.next(false);
    this.userId = null ;
    this.route.navigate(["/"]);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }


  private saveAuthData(token: string, expirationDate: Date, userId : string){
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem("userId", userId)
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    
    if(!token || ! expirationDate) return ;

    return {
      token : token,
      expirationDate : new Date(expirationDate),
      userId : userId
    }
  }

}
