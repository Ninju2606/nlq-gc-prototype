import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EncodingService } from '../encoding.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'encoding-pop-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encoding-pop-up.component.html',
  styleUrl: './encoding-pop-up.component.css'
})
export class EncodingPopUpComponent {

  private _open: boolean = false;

  inputId: number = 0;
  inputAttribute: string = '';
  inputIdentity: boolean = false;

  constructor(public encodingService: EncodingService) { }

  isOpen(): boolean {
    return this._open;
  }

  open(): void {
    this._open = true;
  }

  close(): void {
    this._open = false;
    this.resetInput();
  }

  addMapping(): void {
    if (this.inputId <= 0) alert('Die ID muss größer als 0 sein!');
    else if (this.inputAttribute.length == 0) alert('Es wurde kein Attribut vorgegeben');
    else {
      this.encodingService.addMapping(this.inputId, this.inputAttribute, this.inputIdentity);
      this.resetInput();
    }
  }

  private resetInput(): void {
    this.inputId = 0;
    this.inputAttribute = '';
    this.inputIdentity = false;
  }

}
