import { TestBed } from '@angular/core/testing';
import { Project } from '../../../core/models/project.model';
import { I18n } from '../../../i18n/i18n.service';
import { makeProject } from '../../../testing/project.fixture';
import { ProjectCard } from './project-card';

async function render(project: Project) {
  const fixture = TestBed.createComponent(ProjectCard);
  fixture.componentRef.setInput('project', project);
  await fixture.whenStable();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('ProjectCard', () => {
  it('links the title to the repository', async () => {
    const { element } = await render(makeProject());
    const link = element.querySelector<HTMLAnchorElement>('.title a')!;
    expect(link.href).toBe('https://github.com/styxiner/ShellText');
    expect(link.textContent?.trim()).toBe('ShellText');
  });

  it('draws the ls fallback with the language extension when there is no image', async () => {
    const { element } = await render(makeProject());
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.cmd')?.textContent).toContain('ls -ld shelltext/');
    expect(element.querySelector('.ext')?.textContent?.trim()).toBe('.py');
  });

  it('falls back to the drawn panel when the image fails to load', async () => {
    const { fixture, element } = await render(makeProject({ imageUrl: 'images/missing.png' }));
    element.querySelector('img')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.ext')).not.toBeNull();
  });

  it('prints a tree for grouped repositories', async () => {
    const { element } = await render(
      makeProject({
        slug: 'complyx',
        featured: true,
        repos: [
          { name: 'complyx-agent', repoUrl: '', language: 'Rust', description: null },
          { name: 'complyx', repoUrl: '', language: null, description: null },
        ],
      }),
    );
    const lines = [...element.querySelectorAll('.tree p')].map((line) => line.textContent);
    expect(lines[1]).toContain('├── complyx-agent');
    expect(lines[2]).toContain('└── complyx');
    expect(element.classList).toContain('featured');
  });

  it('shows the description in the current language', async () => {
    TestBed.inject(I18n).setLang('en');
    const { fixture, element } = await render(
      makeProject({ description: { es: 'Editor de texto', en: 'Text editor' } }),
    );
    expect(element.querySelector('.desc')?.textContent?.trim()).toBe('Text editor');

    TestBed.inject(I18n).setLang('es');
    await fixture.whenStable();
    expect(element.querySelector('.desc')?.textContent?.trim()).toBe('Editor de texto');
  });

  it('marks a missing description instead of leaving a gap', async () => {
    const { element } = await render(makeProject({ description: null }));
    expect(element.querySelector('.desc.empty')).not.toBeNull();
  });
});
