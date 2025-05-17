export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuestionnaireResponse {
  codingConfidence: 'none' | 'some' | 'comfortable' | 'confident';
  repetitionPreference: 'low' | 'medium' | 'high' | 'auto';
  usageFrequency: 'daily' | 'weekly' | 'occasional' | 'unsure';
  learningGoal: 'memorize' | 'apply' | 'problemSolving' | 'all';
  progressionPreference: 'fixed' | 'accuracy' | 'auto' | 'manual';
}

export interface LearningConfig {
  startLevel: SkillLevel;
  repetitions: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  progression: 'fixed' | 'accuracy' | 'auto' | 'manual';
}

export interface UserProfile {
  name: string;
  config: LearningConfig;
  progress: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}
