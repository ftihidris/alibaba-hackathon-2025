import { Component } from '@angular/core';
import { ProfileService } from '../services/profile-service.service';
import { Router } from '@angular/router';
import {
  QuestionnaireResponse,
  UserProfile,
  LearningConfig,
  SkillLevel,
} from '../shared/user-profile';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css'],
  standalone: false,
})
export class CreateProfileComponent {
  userName: string = '';
  response: QuestionnaireResponse = {
    codingConfidence: 'none',
    repetitionPreference: 'medium',
    usageFrequency: 'weekly',
    learningGoal: 'apply',
    progressionPreference: 'fixed',
  };

  constructor(private profileService: ProfileService, private router: Router) {}

  submitQuestionnaire(): void {
    if (!this.userName.trim()) {
      alert('Please enter your name before submitting.');
      return;
    }

    const config = this.configureLearning(this.response);
    const profile: UserProfile = {
      name: this.userName.trim(),
      config,
      progress: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      },
    };

    this.profileService.saveProfile(profile);
    alert(`Welcome ${profile.name}, your profile has been saved!`);

    // Navigate to the selected starting level
    this.router.navigate(['/' + config.startLevel]);
  }

  configureLearning(response: QuestionnaireResponse): LearningConfig {
    let startLevel: SkillLevel;
    switch (response.codingConfidence) {
      case 'none':
      case 'some':
        startLevel = 'beginner';
        break;
      case 'comfortable':
        startLevel = 'intermediate';
        break;
      case 'confident':
        startLevel = 'advanced';
        break;
    }

    let reps = { beginner: 3, intermediate: 3, advanced: 2 };
    switch (response.repetitionPreference) {
      case 'low':
        reps = { beginner: 2, intermediate: 2, advanced: 1 };
        break;
      case 'medium':
        reps = { beginner: 3, intermediate: 3, advanced: 2 };
        break;
      case 'high':
        reps = { beginner: 5, intermediate: 5, advanced: 3 };
        break;
      case 'auto':
        reps = {
          beginner: startLevel === 'beginner' ? 4 : 2,
          intermediate: startLevel === 'intermediate' ? 4 : 2,
          advanced: 2,
        };
        break;
    }

    return {
      startLevel,
      repetitions: reps,
      progression: response.progressionPreference,
    };
  }
}
