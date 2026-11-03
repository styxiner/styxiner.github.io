import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProjectsFile } from '../models/project.model';
import { makeProject } from '../../testing/project.fixture';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectsService);
    http = TestBed.inject(HttpTestingController);
    TestBed.inject(ApplicationRef).tick();
  });

  afterEach(() => http.verify());

  it('exposes the projects and counts languages', async () => {
    const file: ProjectsFile = {
      generatedAt: '2026-11-03T00:00:00Z',
      user: 'styxiner',
      activity: {
        lastPushRepo: 'a',
        lastPushAt: '2026-11-02T00:00:00Z',
        publicRepos: 3,
        memberSince: '2024-02-19T00:00:00Z',
        languages: [],
      },
      projects: [
        makeProject({ slug: 'a', language: 'Python' }),
        makeProject({ slug: 'b', language: 'Rust' }),
        makeProject({ slug: 'c', language: 'Python' }),
        makeProject({ slug: 'd', language: null }),
      ],
    };

    expect(service.isLoading()).toBe(true);
    http.expectOne('data/projects.json').flush(file);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.projects().length).toBe(4);
    expect(service.languages()).toEqual([
      { name: 'Python', count: 2 },
      { name: 'Rust', count: 1 },
    ]);
    expect(service.hasError()).toBe(false);
  });

  it('reports an error when the file cannot be read', async () => {
    http.expectOne('data/projects.json').flush('', { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.hasError()).toBe(true);
    expect(service.projects()).toEqual([]);
  });
});
