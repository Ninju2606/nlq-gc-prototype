import { Injectable } from '@angular/core';
import { HttpCommunicatorService } from './http-communicator.service';

export interface EncodingMapping {
  id: number;
  attribute: string;
  identityMapping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EncodingService {

  mappings: EncodingMapping[] = [];

  constructor(private httpService: HttpCommunicatorService) {
    httpService.getEncodingMappings().subscribe({
      next: response => {
        this.mappings = JSON.parse(JSON.stringify(response.body));
      }
    })
  }

  addMapping(id: number, attribute: string, identityMapping: boolean): void {
    this.mappings = this.mappings.filter(m => m.id != id);

    var newMapping: EncodingMapping = { id: id, attribute: attribute, identityMapping: identityMapping };
    this.mappings.push(newMapping);
    this.httpService.addEncodingMapping(JSON.stringify(newMapping));
  }

  removeMapping(id: number): void {
    this.mappings = this.mappings.filter(m => m.id != id);
    this.httpService.removeEncodingMapping(id);
  }
}
