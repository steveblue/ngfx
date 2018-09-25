import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgFxSurface } from './../../interfaces/surface';

@Directive({
  selector: 'ngfxSurface, [ngfxSurface]'
})
export class NgFxSurfaceDirective {
  @Input('surfaceId')
  surfaceId: string;

  @HostBinding('style.grid')
  get grid(): SafeStyle {
    return this.sanitize(this.getSurface().style.grid) || this.sanitize('');
  }

  @HostBinding('style.grid-gap')
  get gridGap(): SafeStyle {
    return this.sanitize(this.getSurface().style.gridGap) || this.sanitize('');
  }

  @HostBinding('style.display')
  get display(): SafeStyle {
    return this.getSurface().style.display ? this.sanitize(this.getSurface().style.display) : 'grid';
  }

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  getSurface() {
    return this._controller.surfaces[this.surfaceId];
  }

  sanitize(style: string): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }
}
