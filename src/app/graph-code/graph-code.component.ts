import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EncodingService } from '../encoding.service';

@Component({
  selector: 'graph-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph-code.component.html',
  styleUrl: './graph-code.component.css'
})
export class GraphCodeComponent {
  @Input() matrix: number[][] = [];
  @Input() dictionary: string[] = [];

  constructor(public encodingService: EncodingService) { }

  foo(entry: number): string {
    if (entry <= 0) return '';
    var mappings = this.encodingService.mappings.filter(mapping => mapping.id === entry);
    if (mappings.length === 0) return '';
    return `{${mappings[0].attribute} - IdentityMapping: ${mappings[0].identityMapping}}`
  }
}
