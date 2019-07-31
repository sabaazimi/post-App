import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { LoginComponent } from './auth/login/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { AuthGaurd } from './auth/auth-gaurd';

const routes: Routes = [
  {path:'', component: PostListComponent},
  {path:'create', component:PostCreateComponent, canActivate: [AuthGaurd]},
  {path:'edit/:postId', component:PostCreateComponent , canActivate: [AuthGaurd]},
  {path:'login', component:LoginComponent},
  {path:'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class AppRoutingModule { }
