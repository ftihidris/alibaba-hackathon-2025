import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Question, QuestionService } from '../services/question.service';

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

  userCode: string = '';
  selectedLanguage: string = 'swift'; // Language keys are lowercase in JSON
  instruction: string = 'Rewrite code snippet';
  points: number = 7;
  difficulty: string = 'Beginner';

  constructor(private router: Router, private questionService: QuestionService) {}

  ngOnInit() {
    this.questionService.getQuestions().subscribe((data: Question[]) => {
      this.questions = data;
    });
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

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.userCode = '';
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.userCode = '';
    }
  }

  onSubmit() {
    alert('Submitted answer for Question ' + (this.currentIndex + 1));
  }

  onBack() {
    this.router.navigate(['/']); // Or any route you want
  }
}
