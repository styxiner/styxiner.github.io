import { TestBed } from '@angular/core/testing';
import { StatusTag } from './status-tag';

describe('StatusTag', () => {
  async function tagText(code: string) {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('code', code);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('.tag')?.textContent;
  }

  it('pads short codes like systemd does', async () => {
    expect(await tagText('OK')).toBe('[ OK ]');
  });

  it('leaves six-letter codes unpadded', async () => {
    expect(await tagText('FAILED')).toBe('[FAILED]');
  });
});
