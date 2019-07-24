import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs' ;
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
private postSub : Subscription ;

  constructor(public postsServive: PostsService) { }

  ngOnInit() {
   this.postsServive.getPost();
    this. postSub = this.postsServive.getPostUpdateListener()
                      .subscribe((posts : Post[]) => {
                          this.posts = posts;
                      })
  }


  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
