import { Injectable } from '@angular/core';
import { Post } from './posts/post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { strictEqual } from 'assert';
import { map } from 'rxjs/operators' ;
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts : Post[] = [] ;
  private postUpdated = new Subject<Post[]>();
  nodeUrl = 'http://localhost:3000/api/posts/' ;


  redirectRoute(reqPage:string){
    this.route.navigate([reqPage]);
  }

  constructor(private http: HttpClient , private route:Router) { }

  getPost(){
    this.http.get<{message:string , posts: any}>(this.nodeUrl)
      .pipe(map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content:post.content,
              id: post._id
            };
          });
      }))
      .subscribe((modifiedData) => {
          this.posts = modifiedData ;
          this.postUpdated.next([...this.posts]);
      }) ;
    ; 
  }



  getpost(id: string){
    //return {...this.posts.find( p => p.id === id)};
    return this.http.get<{_id:string, title:string, content:string}>(this.nodeUrl+id);
  }


  updatePost(id:string, title:string, content:string){
    const post = {id: id , title:title, content:content} ;
    this.http.put(this.nodeUrl+id , post).subscribe( data => {
      console.log(data);
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex( p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts ;
      this.postUpdated.next([...this.posts]);
      this.redirectRoute("/");
    })
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  addPost(title:string, content:string){
    const post = {id: null, title : title , content : content} ;
    this.http.post<{message:string , postId: string}>(this.nodeUrl, post)
      .subscribe( (data) => {
        const id = data.postId ;
        post.id = id ;
        console.log(data.message);
        this.posts.push(post) ;
        this.postUpdated.next([...this.posts]);
        this.redirectRoute("/");
      })



    
  }

  deletePost(postId: string) {
    this.http.delete(this.nodeUrl + postId )
      .subscribe(() => {
        console.log(`ths posst with ID: ${postId} is deleted`);
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost ;
        this.postUpdated.next([...this.posts]);
      })
  }
  
}
