import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgFxSurface } from './../../interfaces/surface';

@Directive({
  selector: 'ngfxSurface, [ngfxSurface]'
})
export class NgFxSurfaceDirective {
  @Input('surface')
  surface: NgFxSurface;

  @HostBinding('style.grid')
  get grid(): SafeStyle {
    return this.sanitize(this.surface.style.grid) || this.sanitize('');
  }

  @HostBinding('style.grid-gap')
  get gridGap(): SafeStyle {
    return this.sanitize(this.surface.style.gridGap) || this.sanitize('');
  }

  @HostBinding('style.display')
  get display(): SafeStyle {
    return this.sanitize(this.surface.style.display) || this.sanitize('grid');
  }

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  sanitize(style: string): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }
}
