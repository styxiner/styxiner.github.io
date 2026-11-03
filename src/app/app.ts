import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { About } from './features/about/about';
import { Certifications } from './features/certifications/certifications';
import { Contact } from './features/contact/contact';
import { Hero } from './features/hero/hero';
import { Projects } from './features/projects/projects';
import { Skills } from './features/skills/skills';
import { I18n } from './i18n/i18n.service';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Hero, About, Skills, Projects, Certifications, Contact],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly t = inject(I18n).t;
}
