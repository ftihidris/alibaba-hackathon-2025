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
            'Please give me the answer in plain text without a special character.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
