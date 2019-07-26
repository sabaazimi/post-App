import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../posts/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle:string='';
  enteredContent:string='';
  //@Output() createdPost  = new EventEmitter<Post>();
  private mode = 'create';
  private postId:string ;
  post:Post ;
  constructor( private postsService: PostsService, public route: ActivatedRoute) { }

  onSavePost(form:NgForm){

    if(form.invalid) return;
    if (this.mode === 'create'){
      this.postsService.addPost(form.value.txtTitle, form.value.txtContent) ;
    }else {
      this.postsService.updatePost(this.postId, form.value.txtTitle, form.value.txtContent);
    }
    form.resetForm()

    // const post : Post =
    //                  {title : form.value.txtTitle , content: form.value.txtContent  } ;
    // this.createdPost.emit(post);
  }


  ngOnInit() {
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.postsService.getpost(this.postId).subscribe( result => {
            this.post = {id: result._id, title: result.title, content: result.content }
          });
          console.log(`post with id ${this.postId} is updated`);
        }else {
          this.mode = 'create';
          this.postId = null ;
        }
    })

  }

}
