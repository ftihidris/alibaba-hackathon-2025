import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

declare const monaco: any;

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.css'],
})
export class BeginnerComponent {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  userCode: string = '';
  questionTitle: string = 'Prime Number Check';
  points: number = 7;
  difficulty: string = 'Beginner';
  instruction: string = 'Rewrite code snippet';
  selectedLanguage: string = 'Swift';
  codeSnippet: string = `
func isPrime(_ num: Int) -> Bool {
    if num < 2 {
        return false
    }
    for i in 2 ..< Int(Double(num).squareRoot()) + 1 {
        if num % i == 0 {
            return false
        }
    }
    return true
}
`;

  constructor(private router: Router) {}

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  onBack() {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    const onGotAmdLoader = () => {
      // Load Monaco
      (window as any).require.config({ paths: { vs: 'assets/monaco/vs' } });
      (window as any).require(['vs/editor/editor.main'], () => {
        monaco.editor.create(this.editorContainer.nativeElement, {
          value: `function helloWorld() {\n  console.log("Hello, world!");\n}`,
          language: 'javascript',
          theme: 'vs-dark',
          automaticLayout: true,
          lineNumbers: 'on',
        });
      });
    };

    // Load AMD loader if necessary
    if (!(window as any).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'assets/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
}
