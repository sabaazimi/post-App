import { Injectable } from '@angular/core';
import { Post } from './posts/post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { strictEqual } from 'assert';
import { map } from 'rxjs/operators' ;
import { Router } from '@angular/router';
import { environment } from "../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts : Post[] = [] ;
  private postUpdated = new Subject<{posts: Post[], postCount:number}>();
  nodeUrl = environment.apiURL + '/posts/' ;


  redirectRoute(reqPage:string){
    this.route.navigate([reqPage]);
  }

  constructor(private http: HttpClient , private route:Router) { }

  getPost(postsPerPage:number, currentPage:number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message:string , posts: any, maxPost: number}>(this.nodeUrl + queryParams)
      .pipe(map(postData => {
          return { posts: postData.posts.map(post => {
            return {
              title: post.title,
              content:post.content,
              id: post._id,
              imagePath :  post.imagePath,
              creator: post.creator
            };
          }), maxPosts : postData.maxPost
      }}))
      .subscribe((modifiedData) => {
          this.posts = modifiedData.posts ;
          this.postUpdated.next({
            posts: [...this.posts], 
            postCount : modifiedData.maxPosts});
      }) ;
    ; 
  }



  getpost(id: string){
    //return {...this.posts.find( p => p.id === id)};
    return this.http.get<{
      _id:string, 
      title:string, 
      content:string, 
      imagePath:string,
      creator : string
    }>(this.nodeUrl+id);
  }


  updatePost(id:string, title:string, content:string, image : File | string){
    let postData: Post | FormData
    if (typeof(image) ==='object'){
      postData= new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);

    }else {
      postData = {
        id: id , 
        title: title,
        content:content , 
        imagePath:image,
        creator:null
      };

    }


    this.http.put(this.nodeUrl+id , postData)
      .subscribe( data => {
          // console.log(data);
          // const updatedPosts = [...this.posts];
          // const oldPostIndex = updatedPosts.findIndex( p => p.id === id);
          // const post: Post = {
          //   id: id , 
          //   title: title,
          //   content:content , 
          //   imagePath:""
          // }
          // updatedPosts[oldPostIndex] = post;
          // this.posts = updatedPosts ;
          // this.postUpdated.next([...this.posts]);
          this.redirectRoute("/");
    })
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  addPost(title:string, content:string, image:File){
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title );
    //const post = {id: null, title : title , content : content} ;
    this.http.post<{message:string , post:Post}>
                  (this.nodeUrl, postData)
                  .subscribe( (data) => { 
                        // const post:Post ={ 
                        //   id: data.post.id, 
                        //   title: title, 
                        //   content:content,
                        //   imagePath : data.post.imagePath } ;
                        // console.log(data.message);
                        // this.posts.push(post) ;
                        // this.postUpdated.next([...this.posts]);
                        this.redirectRoute("/");
      })



    
  }

  deletePost(postId: string) {
    return this.http.delete(this.nodeUrl + postId );
      // .subscribe(() => {
      //   console.log(`ths posst with ID: ${postId} is deleted`);
      //   const updatedPost = this.posts.filter(post => post.id !== postId);
      //   this.posts = updatedPost ;
      //   this.postUpdated.next([...this.posts]);
      // })
  }
  
}
