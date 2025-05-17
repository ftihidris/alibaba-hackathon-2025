import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  question: string;
  solutions: { [language: string]: string };
  hint: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private jsonURL = './question.json';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.jsonURL);
  }
}

