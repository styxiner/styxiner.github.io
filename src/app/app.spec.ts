import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  async function render() {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('data/projects.json').flush({
      generatedAt: '2026-11-03T00:00:00Z',
      user: 'styxiner',
      activity: null,
      projects: [],
    });
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('renders the name as the only h1', async () => {
    const element = await render();
    const headings = element.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent).toContain('styxiner');
  });

  it('renders every section the navigation links to', async () => {
    const element = await render();
    for (const id of ['about', 'stack', 'projects', 'certs', 'contact']) {
      expect(element.querySelector(`#${id}`), id).not.toBeNull();
    }
  });
});
