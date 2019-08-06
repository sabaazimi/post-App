import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs' ;
import { PageEvent } from '@angular/material';
import { PostCreateComponent } from '../post-create/post-create.component';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title : 'this is first post', content : 'content of the first post'},
  //   {title : 'this is socond post', content : 'content of the second post'},
  //   {title : 'this is third post', content : 'content of the third post'},
  // ] ;

posts: Post[] = [] ;
isLoading = false ;
//totalPost = PostsService.length ;
totalPost = 0;
postPerPage = 2 ;
currentPage = 1 ;
pageSizeOption = [1, 2, 5, 10];
isUserAuthenticated = false ;
private postSub : Subscription ;
userId:string ;
private authStatusSubs: Subscription ;


  constructor(public postsServive: PostsService, private authService:AuthService) { }

  ngOnInit() {
    this.isLoading = true ;
    this.postsServive.getPost(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this. postSub = this.postsServive.getPostUpdateListener()
                      .subscribe((postData : {posts: Post[] , postCount: number}) => {
                          this.isLoading=false ;
                          this.totalPost = postData.postCount;
                          this.posts = postData.posts;
                          //this.totalPost = posts.length ;
                      });
    this.isUserAuthenticated = this.authService.isAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe( isAuthenticated => {

        this.isUserAuthenticated = isAuthenticated ;
        this.userId = this.authService.getUserId();
    });
  }  

  onChangePage(pageData: PageEvent){
    this.isLoading=true;
    this.currentPage = pageData.pageIndex + 1 ;
    this.postPerPage = pageData.pageSize;
    this.postsServive.getPost(this.postPerPage, this.currentPage);
    console.log(pageData);
  }  

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

  onDelete(postId){
    this.isLoading=true;
    this.postsServive.deletePost(postId)
    .subscribe(()=>{
      this.postsServive.getPost(this.postPerPage, this.currentPage);
    } , () => {
      this.isLoading =false ;
    })
  }


}
