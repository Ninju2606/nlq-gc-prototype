import { AfterViewInit, Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { HttpCommunicatorService } from './http-communicator.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PromptPopUpComponent } from "./prompt-pop-up/prompt-pop-up.component";
import { EncodingPopUpComponent } from './encoding-pop-up/encoding-pop-up.component';

export interface Prompt {
  key: string;
  prompt: string;
}

export interface GraphCode {
  state: string;
  model: string;
  dictionary: string[];
  matrix: number[][];
  error: string;
  description: string;
  start: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule, PromptPopUpComponent, EncodingPopUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  @ViewChild(PromptPopUpComponent) promptPopup!: PromptPopUpComponent;
  @ViewChild(EncodingPopUpComponent) encodingPopup!: EncodingPopUpComponent;

  title = 'NLQ-GC-Prototyp';
  promptGCSelected: string = '';
  promptKeywordSelected: string = '';
  llmSelected: string = '';
  query: string = '';
  username: string = '';

  loading: boolean = false;

  promptsGC: Prompt[] = [];
  promptsKeywords: Prompt[] = [];
  llms: String[] = [];

  currentGraphCode: GraphCode | null = null;


  constructor(private httpService: HttpCommunicatorService) {
  }

  ngAfterViewInit() {
    this.parsePrompts(this.httpService.getPromptsGC(), this.promptsGC);
    this.parsePrompts(this.httpService.getPromptsKeyword(), this.promptsKeywords);
    this.parseLLMs(this.httpService.getLLMs());
  }

  public showGCPrompts(): void {
    this.promptPopup.open(this.promptsGC, 'GraphCode Prompts');
  }

  public showKeywordPrompts(): void {
    this.promptPopup.open(this.promptsKeywords, 'Keyword Prompts');
  }

  public async transmitQuery(): Promise<void> {
    if (this.query.length == 0 || this.username.length == 0) {
      alert("Bitte gib eine Anfrage sowie einen Nutzernamen an!");
      return;
    }
    this.loading = true;
    this.currentGraphCode = null;
    var response = this.httpService.sendRequest(this.query, this.username, this.promptGCSelected, this.promptKeywordSelected, this.llmSelected);
    var transactionId = '';
    response.subscribe({
      next: res => {
        transactionId = JSON.parse(JSON.stringify(res.body))['transactionId'];
      },
      complete: () => {
        if (transactionId.length !== 0) setTimeout(() => this.pollTransaction(transactionId), 1000);
        else this.loading = false;
      }
    });
  }

  private pollTransaction(transactionId: string) {
    var response = this.httpService.checkTransaction(transactionId);
    var graphCode: GraphCode | null = null;
    response.subscribe({
      next: res => {
        graphCode = JSON.parse(JSON.stringify(res.body));
        console.log(graphCode);
      },
      complete: () => {
        if (graphCode == null || graphCode.state == "NOT_AVAILABLE") {
          alert("Es gab einen Fehler bei der GraphCode-Verarbeitung");
          this.loading = false;
        }
        else if (graphCode.state == "PENDING") setTimeout(() => this.pollTransaction(transactionId), 1000);
        else {
          this.loading = false;
          if (graphCode.state == "FINISHED") this.currentGraphCode = graphCode;
          else alert(graphCode.error)
        }
      }
    });
  }

  private parsePrompts(input: Observable<HttpResponse<string>>, list: Prompt[]): void {
    input.subscribe({
      next: response => {
        var inputParsed = JSON.parse(JSON.stringify(response.body));
        Object.keys(inputParsed).forEach(key => {
          var current = {} as Prompt;
          current.key = key;
          current.prompt = inputParsed[key];
          list.push(current);
        });
      }
    });
  }

  private parseLLMs(input: Observable<HttpResponse<string>>) {
    input.subscribe({
      next: response => {
        var inputParsed = JSON.parse(JSON.stringify(response.body));
        inputParsed.forEach((entry: String) => this.llms.push(entry));
      }
    });
  }

}
