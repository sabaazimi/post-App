import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Post } from '../posts/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator' ;
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  enteredTitle:string='';
  enteredContent:string='';
  //@Output() createdPost  = new EventEmitter<Post>();
  private mode = 'create';
  private postId:string ;
  post:Post ;
  form : FormGroup ;
  imagePreview;
  isLoading = false ;
  private authStatusSubs: Subscription;

  constructor( private postsService: PostsService, 
               public route: ActivatedRoute,
               public authService: AuthService) { }

  onSavePost(){

    if(this.form.invalid) return;
    this.isLoading = true ;
    if (this.mode === 'create'){
      this.postsService.addPost(
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image) ;
    }else {
      this.postsService.updatePost(
        this.postId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image);
    }
    this.form.reset()

    // const post : Post =
    //                  {title : form.value.txtTitle , content: form.value.txtContent  } ;
    // this.createdPost.emit(post);
  }


  onImagePick(event: Event) {
    const file =(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result ;
    }

    reader.readAsDataURL(file);

  }


  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
      authData => {
        this.isLoading = false ;
      }
    )
    this.form = new FormGroup({
      title : new FormControl(null,{
        validators: [Validators.required , Validators.minLength(3)]
      }),
      content : new FormControl(null, { 
        validators : [Validators.required]
      }),
      image: new FormControl(null, {
        validators :[Validators.required],
        asyncValidators : [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true ;
          this.postsService.getpost(this.postId).subscribe( result => {
            this.isLoading = false ;
            this.post = {
              id: result._id, 
              title: result.title, 
              content: result.content,
              imagePath : result.imagePath,
              creator: result.creator
            } ;
            this.form.setValue({
              title: this.post.title,
              content:this.post.content,
              image : this.post.imagePath
            })
          });
         
          console.log(`post with id ${this.postId} is updated`);
        }else {
          this.mode = 'create';
          this.postId = null ;
        }
    })

  }


  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
