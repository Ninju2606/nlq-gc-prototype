import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpCommunicatorService {

    readonly apiUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    public getPromptsGC(): Observable<HttpResponse<string>> {
        return this.http.get<string>(`${this.apiUrl}/enums/promptsGC`, { observe: 'response' });
    }

    public getPromptsKeyword(): Observable<HttpResponse<string>> {
        return this.http.get<string>(`${this.apiUrl}/enums/promptsKeyword`, { observe: 'response' });
    }

    public getLLMs(): Observable<HttpResponse<string>> {
        return this.http.get<string>(`${this.apiUrl}/enums/models`, { observe: 'response' });
    }

    public sendRequest(query: string, user: string, promptGC: string, promptKeyword: string, llm: string): Observable<HttpResponse<string>> {
        var url = `${this.apiUrl}/handleNLQ?query=${query}&user=${user}&promptKeyword=${promptKeyword}&promptGC=${promptGC}&model==${llm}`;
        return this.http.post<string>(url, {}, { observe: 'response' });
    }

    public checkTransaction(transactionId: string): Observable<HttpResponse<string>> {
        var url = `${this.apiUrl}/graphCode?transactionId=${transactionId}`;
        return this.http.get<string>(url, { observe: 'response' });
    }

    public getEncodingMappings(): Observable<HttpResponse<string>> {
        return this.http.get<string>(`${this.apiUrl}/encoding/`, { observe: 'response' });
    }

    public removeEncodingMapping(id: number): void {
        this.http.delete<string>(`${this.apiUrl}/encoding/remove?id=${id}`, {}).subscribe();
    }

    public addEncodingMapping(mapping: string): void {
        this.http.put<string>(`${this.apiUrl}/encoding/add`, mapping).subscribe();
    }

}