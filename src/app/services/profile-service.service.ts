// shared/services/profile.service.ts
import { Injectable } from '@angular/core';
import { UserProfile, SkillLevel } from '../shared/user-profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileKey = '';
  private profile: UserProfile | null = null;

  saveProfile(profile: UserProfile): void {
    this.profileKey = `profile_${profile.name}`;
    this.profile = profile;
    localStorage.setItem(this.profileKey, JSON.stringify(profile));
    console.log('Profile saved:', profile);
  }

  loadProfile(name: string): void {
    this.profileKey = `profile_${name}`;
    const data = localStorage.getItem(this.profileKey);
    if (data) {
      this.profile = JSON.parse(data);
    }
  }

  getProfile(): UserProfile | null {
    return this.profile;
  }

  updateProgress(level: SkillLevel): void {
    if (this.profile) {
      this.profile.progress[level]++;
      localStorage.setItem(this.profileKey, JSON.stringify(this.profile));
    }
  }

  getRepetitionCount(level: SkillLevel): number {
    return this.profile?.config.repetitions[level] ?? 0;
  }
}
