import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileService } from '../services/profile-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(): boolean {
    const profile = this.profileService.getProfile(); // assumes this returns null if no profile
    if (profile) {
      return true;
    } else {
      alert('Please create your profile before starting.');
      this.router.navigate(['/profile']);
      return false;
    }
  }
}
