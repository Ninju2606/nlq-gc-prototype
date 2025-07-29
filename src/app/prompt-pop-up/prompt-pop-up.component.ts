import { Component } from '@angular/core';
import { Prompt } from '../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'prompt-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompt-pop-up.component.html',
  styleUrl: './prompt-pop-up.component.css'
})
export class PromptPopUpComponent {

  prompts: Prompt[] = [];
  name: string = '';

  open(prompts: Prompt[], name: string): void {
    this.prompts = prompts;
    this.name = name;
    console.log(prompts[0].prompt);
  }

  isOpen(): boolean {
    return this.prompts.length != 0;
  }

  close(): void {
    this.prompts = [];
    this.name = '';
  }

}
