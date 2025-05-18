import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Question, QuestionService } from '../services/question.service';
import { QwenApiService } from '../services/qwen-api.service';

@Component({
  selector: 'app-beginner',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.css'],
})
export class BeginnerComponent implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  questions: Question[] = [];
  currentIndex: number = 0;
  isCorrect: boolean | null = null;

  userCode: string = '';
  selectedLanguage: string = 'swift'; // default language
  instruction: string = 'Rewrite code snippet';
  points: number = 0; // total points
  isSubmitted: boolean = false;

  startTime: number = 0;

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private aiService: QwenApiService
  ) {}

  ngOnInit() {
    this.questionService.getQuestions().subscribe((data: Question[]) => {
      this.questions = this.shuffleArray(data);
      this.startTime = Date.now();
    });
  }

  shuffleArray(array: any[]) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentIndex] || null;
  }

  get questionTitle(): string {
    return this.currentQuestion?.question || '';
  }

  get codeSnippet(): string {
    return this.currentQuestion?.solutions[this.selectedLanguage] || '';
  }

  get hint(): string {
    return this.currentQuestion?.hint || '';
  }

  onSubmit() {
    if (this.isSubmitted) {
      this.nextQuestion();
      return;
    }

    const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds

    const prompt = `
You are a code evaluator.

First, check if the student's answer is empty, contains only comments, or is clearly incomplete. If so, return "false".

Then, compare the student's answer to the expected solution.

Ignore all differences in:
- indentation
- whitespace
- formatting
- variable names (if they serve the same purpose)

Evaluate only the logic and correctness.

Question: "${this.questionTitle}"
Expected solution in ${this.selectedLanguage}:
${this.codeSnippet}

Student's answer:
${this.userCode}

Return only one word:
true => if the logic is correct.
false => if the logic is incorrect or blank.
`;

    this.aiService.validateCode(prompt).subscribe((res) => {
      const aiResult = res.choices?.[0]?.message?.content?.trim().toLowerCase();

      if (aiResult === 'true') {
        this.isCorrect = true;

        if (elapsedTime <= 60) {
          this.points += 10;
        } else {
          this.points += 7;
        }
      } else if (aiResult === 'false') {
        this.isCorrect = false;
      } else {
        this.isCorrect = null;
      }

      this.isSubmitted = true;
    });
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.userCode = '';
      this.isCorrect = null;
      this.isSubmitted = false;
      this.startTime = Date.now();
    } else {
      alert('You have completed all questions!');
      // Optionally navigate away or reset
      // this.router.navigate(['/']);
    }
  }

  onBack() {
    this.router.navigate(['/']); // adjust route as needed
  }
}
