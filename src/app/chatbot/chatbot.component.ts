import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { QwenApiService } from '../services/qwen-api.service';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: false,
})
export class ChatbotComponent implements OnInit, OnDestroy {
  userInput: string = '';
  messages: Message[] = [];
  isChatbotVisible = false;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private chatbotService: QwenApiService) {}

  ngOnInit(): void {
    this.messages.push({
      sender: 'bot',
      text: 'Hello! How can I assist you today?',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearMessages(): void {
    this.messages = [];
    this.messages.push({ sender: 'bot', text: 'Chat history cleared.' });
  }

  sendMessage(): void {
    const prompt = this.userInput.trim();
    if (!prompt) return;

    this.messages.push({ sender: 'user', text: prompt });
    this.userInput = '';
    this.isLoading = true;

    this.chatbotService
      .sendMessageToBot(prompt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          let reply = 'No reply.';
          if (
            response?.choices &&
            response.choices.length > 0 &&
            response.choices[0].message?.content
          ) {
            reply = response.choices[0].message.content.trim();
          }
          this.messages.push({ sender: 'bot', text: reply });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('API error:', error);
          this.messages.push({
            sender: 'bot',
            text: '⚠️ Error getting response from the assistant.',
          });
        },
      });
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKeyPress(event: KeyboardEvent): void {
    if (this.userInput.trim()) {
      this.sendMessage();
    }
  }
}
