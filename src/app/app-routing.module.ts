import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BeginnerComponent } from './beginner/beginner.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ProfileGuard } from './guards/profile.guard';
import { AdvancedComponent } from './advanced/advanced.component';
import { IntermediateComponent } from './intermediate/intermediate.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'beginner',
    component: BeginnerComponent,
    // canActivate: [ProfileGuard],
  },
  {
    path: 'advanced',
    component: AdvancedComponent,
  },
  {
    path: 'intermediate',
    component: IntermediateComponent,
  },
  {
    path: 'profile',
    component: CreateProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
