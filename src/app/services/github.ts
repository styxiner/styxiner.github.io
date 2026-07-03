import { Service } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repo } from '../models/repo';

//@Service()
//export class Github {}

@Injectable({ provideIn: 'root'})
export class GithubService {
  private http inject(HttpClient);
  private readonly apiUrl = 'https://api.github.com/users/styxiner/repos';

  getRepos(): Observable<Repo[]> {
    return this.http.get<Repo[]>(this.apiUrl, {
      params: { sort: 'stars', 'per_page: 12'}
    });
  }
}

