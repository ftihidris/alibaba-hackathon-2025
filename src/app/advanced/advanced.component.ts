import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Question, QuestionService } from '../services/question.service';
import { QwenApiService } from '../services/qwen-api.service';
import { LineBreaksPipe } from '../linebreaks.pipe';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, LineBreaksPipe],
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css'],
})
export class AdvancedComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  questions: Question[] = [];
  currentIndex = 0;
  userCode = '';
  selectedLanguage = 'swift';
  instruction =
    'Write the complete solution from scratch based on the question below.';
  points = 0;
  difficulty = 'Advanced';
  timeLeft = 300; // 5 minutes
  timerInterval: any = null;
  isSubmitted = false;
  feedback: string = '';
  submittedTime = 0;
  isCorrect: boolean | null = null;

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private aiService: QwenApiService
  ) {}

  shuffleArray(array: Question[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  ngOnInit() {
    this.questionService.getQuestions().subscribe((data: Question[]) => {
      this.shuffleArray(data);
      this.questions = data;
      this.startTimer();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentIndex] || null;
  }

  get questionTitle(): string {
    return this.currentQuestion?.question || '';
  }

  get hint(): string {
    return this.currentQuestion?.hint || '';
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        clearInterval(this.timerInterval);
        this.points -= 3;
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.userCode = '';
      this.timeLeft = 300;
      this.submittedTime = 0;
      this.isSubmitted = false;
      this.feedback = '';
      this.isCorrect = null;
      this.startTimer();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.userCode = '';
      this.timeLeft = 300;
      this.isSubmitted = false;
      this.feedback = '';
      this.startTimer();
    }
  }

  onSubmit() {
    if (this.isSubmitted) {
      // Move to next question
      this.nextQuestion();
      return;
    }

    clearInterval(this.timerInterval);
    this.submittedTime = 300 - this.timeLeft;
    this.isSubmitted = true;

    const prompt = `
You are an expert coding evaluator. A student answered the following coding question. 

Question: "${this.questionTitle}"
Student's Answer (in ${this.selectedLanguage}):
${this.userCode}

Your task:
1. Tell if the answer is CORRECT or INCORRECT.
2. Provide a brief explanation or correction if it's incorrect.
3. Keep it short and clear.
`;

    this.aiService.validateCode(prompt).subscribe((response) => {
      const feedbackText =
        response.choices?.[0]?.message?.content || 'No feedback received.';
      this.feedback = feedbackText;

      const correct =
        /correct/i.test(feedbackText) && !/incorrect/i.test(feedbackText);
      this.isCorrect = correct;

      if (correct) {
        this.points += this.submittedTime <= 240 ? 10 : 7; // 4 mins = 240 seconds
      }
    });
  }

  onBack() {
    this.router.navigate(['/']);
  }
}
