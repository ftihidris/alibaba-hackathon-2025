// import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class QwenApiService {
//   private url =
//     'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
//   private headers = new HttpHeaders({
//     Authorization: `Bearer ${environment.apiKey}`,
//     'Content-Type': 'application/json',
//   });

//   constructor(private http: HttpClient) {}

//   sendMessageToBot(prompt: string): Observable<any> {
//     const body = {
//       model: 'qwen-plus',
//       messages: [{ role: 'user', content: prompt }],
//     };
//     return this.http.post<any>(this.url, body, { headers: this.headers });
//   }
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QwenApiService {
  private apiUrl =
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  sendMessageToBot(userMessage: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content:
            'Please give me the answer in plain text without special characters.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  validateCode(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'qwen-max',
      messages: [
        { role: 'system', content: 'You are an expert programming assistant.' },
        { role: 'user', content: prompt },
      ],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  blankCode(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content:
            'You are a coding assistant. Replace 3–5 keywords in the given code with ___ to make a fill-in-the-blank exercise.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
