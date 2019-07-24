import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../posts/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle:string='';
  enteredContent:string='';
  //@Output() createdPost  = new EventEmitter<Post>();

  constructor( private postsService: PostsService) { }

  onAddPost(form:NgForm){

    if(form.invalid) return;
    this.postsService.addPost(form.value.txtTitle, form.value.txtContent) ;
    form.resetForm()

    // const post : Post =
    //                  {title : form.value.txtTitle , content: form.value.txtContent  } ;
    // this.createdPost.emit(post);
  }


  ngOnInit() {
  }

}
