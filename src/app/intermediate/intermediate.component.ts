import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Question, QuestionService } from '../services/question.service';
import { QwenApiService } from '../services/qwen-api.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-intermediate',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './intermediate.component.html',
  styleUrls: ['./intermediate.component.css'],
})
export class IntermediateComponent implements OnInit {
  questions: Question[] = [];
  currentIndex = 0;
  codeParts: string[] = [];
  blankIndices: number[] = [];
  blankOrder: number[] = [];

  selectedLanguage = 'java';
  instruction = 'Fill in the missing parts of the code';
  points = 0;
  isSubmitted = false;
  startTime = 0;

  blankedCode: string = '';
  fullCode: string = '';
  userAnswers: string[] = [];
  correctBlanks = 0;
  totalBlanks = 0;

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private aiService: QwenApiService
  ) {}

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe((data: Question[]) => {
      this.questions = this.shuffleArray(data);
      this.loadCurrentQuestion();
    });
  }

  shuffleArray(array: any[]) {
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

  get hint(): string {
    return this.currentQuestion?.hint || '';
  }

  highlightNumbers(text: string): string {
    return text.replace(/(\d+)/g, '<b>$1</b>');
  }

  async loadCurrentQuestion() {
    this.isSubmitted = false;
    this.userAnswers = [];
    this.codeParts = [];
    this.blankIndices = [];
    this.blankOrder = [];
    this.correctBlanks = 0;
    this.totalBlanks = 0;

    const question = this.currentQuestion;
    if (!question) return;

    const code = question.solutions[this.selectedLanguage];
    this.fullCode = code;

    const prompt = `
You are an assistant that generates fill-in-the-blank questions.

Given the following ${this.selectedLanguage} code snippet, replace 3–5 important keywords (such as function names, control structures, or operators) with the placeholder "___".

Make sure to preserve formatting and code style. Respond with only the modified code.

Code:
${code}
`;

    // Use RxJS pipe with catchError, no more toPromise()
    this.aiService
      .blankCode(prompt)
      .pipe(
        catchError((err) => {
          console.error('Error generating blanks:', err);
          return of({ choices: [{ message: { content: '' } }] });
        })
      )
      .subscribe((res) => {
        this.blankedCode = res.choices?.[0]?.message?.content?.trim() || '';
        this.splitCodeAndInitializeAnswers();
        this.startTime = Date.now();
      });
  }

  splitCodeAndInitializeAnswers() {
    this.codeParts = this.blankedCode.split(/(___)/);
    this.userAnswers = Array(
      this.codeParts.filter((part) => part === '___').length
    ).fill('');

    this.blankIndices = [];
    for (let i = 0; i < this.codeParts.length; i++) {
      if (this.codeParts[i] === '___') {
        this.blankIndices.push(i);
      }
    }
    this.blankOrder = [...this.blankIndices]; // Create a copy to maintain original order
  }

  onSubmit() {
    if (this.isSubmitted) {
      this.nextQuestion();
      return;
    }

    let filledCode = '';
    let answerIndex = 0;

    // Trim each user answer to avoid mismatch due to extra spaces
    this.codeParts.forEach((part) => {
      if (part === '___') {
        filledCode += this.userAnswers[answerIndex]?.trim() || '';
        answerIndex++;
      } else {
        filledCode += part;
      }
    });

    const prompt = `
You are a smart code checker.

Compare the student's answers with the original code below and determine if each filled blank is correct based on its position.

Respond with a JSON array of true or false values (like [true, false, true]), indicating whether each individual answer is correct.

Only return the array — no explanations.

Language: ${this.selectedLanguage}

Original Code:
\`\`\`
${this.fullCode}
\`\`\`

Student's filled-in code:
\`\`\`
${filledCode}
\`\`\`
`;

    this.aiService
      .validateCode(prompt)
      .pipe(
        catchError((err) => {
          console.error('Error validating code:', err);
          return of({ choices: [{ message: { content: '[]' } }] });
        })
      )
      .subscribe((res) => {
        try {
          const content = res.choices?.[0]?.message?.content?.trim() || '[]';
          const resultArray: boolean[] = JSON.parse(content);

          this.correctBlanks = resultArray.filter((val) => val).length;
          const score = Math.round(
            (this.correctBlanks / this.totalBlanks) * 10
          );
          this.points += score;
        } catch (err) {
          console.error('Failed to parse validation response:', err);
        }

        this.isSubmitted = true;
      });
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.loadCurrentQuestion();
    } else {
      alert('You have completed all intermediate questions!');
      this.router.navigate(['/']);
    }
  }

  onBack() {
    this.router.navigate(['/']);
  }
}
