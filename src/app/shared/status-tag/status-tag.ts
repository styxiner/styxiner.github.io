import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type Tone = 'accent' | 'warn' | 'danger';

/**
 * systemd-style status marker: [ OK ], [ WAIT ], [FAILED].
 * With `loading` the code is replaced by the bouncing asterisk systemd shows while a unit starts.
 */
@Component({
  selector: 'app-status-tag',
  template: `
    <!-- Spacing inside the brackets is significant. -->
    <!-- prettier-ignore -->
    <span class="tag" aria-hidden="true">[@if (loading()) {<span class="star"></span>} @else {<b>{{ padded() }}</b>}]</span>
    <span class="label"><ng-content /></span>
  `,
  styleUrl: './status-tag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'tone()' },
})
export class StatusTag {
  readonly code = input('OK');
  readonly tone = input<Tone>('accent');
  readonly loading = input(false);

  // systemd pads short codes with a space on each side: [ OK ] but [FAILED].
  protected readonly padded = computed(() => {
    const code = this.code();
    return code.length >= 6 ? code : ` ${code} `;
  });
}
