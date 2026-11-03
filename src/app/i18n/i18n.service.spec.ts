import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18n } from './i18n.service';

describe('I18n', () => {
  beforeEach(() => localStorage.clear());

  function create() {
    const i18n = TestBed.inject(I18n);
    TestBed.inject(ApplicationRef).tick();
    return i18n;
  }

  it('starts with a saved choice over the browser language', () => {
    localStorage.setItem('lang', 'es');
    expect(create().lang()).toBe('es');
  });

  it('switches every text and the document language at once', () => {
    const i18n = create();
    i18n.setLang('en');
    TestBed.inject(ApplicationRef).tick();
    expect(i18n.t().about.title).toBe('About me');
    expect(document.documentElement.lang).toBe('en');

    i18n.setLang('es');
    TestBed.inject(ApplicationRef).tick();
    expect(i18n.t().about.title).toBe('Sobre mí');
    expect(document.documentElement.lang).toBe('es');
  });

  it('remembers the choice', () => {
    create().setLang('en');
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('ignores unknown saved values', () => {
    localStorage.setItem('lang', 'klingon');
    expect(['es', 'en']).toContain(create().lang());
  });
});
