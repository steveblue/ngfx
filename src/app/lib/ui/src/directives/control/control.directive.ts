import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({
  selector: 'ngfxControl, [ngfxControl]'
})
export class NgFxControlDirective {
  @Input('control')
  control: NgFxControl;

  @HostBinding('style.color')
  get color(): SafeStyle {
    return this.sanitize(this.control.style.color) || this.sanitize('');
  }

  @HostBinding('style.border-radius')
  get borderRadius(): SafeStyle {
    return this.sanitize(this.control.style.borderRadius) || this.sanitize('');
  }

  @HostBinding('style.background')
  get background(): SafeStyle {
    return this.sanitize(this.control.style.background) || this.sanitize('');
  }

  @HostBinding('style.background-position')
  get backgroundPosition(): SafeStyle {
    return this.sanitize(this.control.style.backgroundPosition) || this.sanitize('');
  }

  @HostBinding('style.background-size')
  get backgroundSize(): SafeStyle {
    return this.sanitize(this.control.style.backgroundSize) || this.sanitize('');
  }

  @HostBinding('style.background-repeat')
  get backgroundRepeat(): SafeStyle {
    return this.sanitize(this.control.style.backgroundSize) || this.sanitize('no-repeat');
  }

  @HostBinding('style.text-align')
  get textAlign(): SafeStyle {
    return this.sanitize(this.control.style.textAlign) || this.sanitize('');
  }

  @HostBinding('style.transform')
  get transform(): SafeStyle {
    return this.sanitize(this.control.style.transform) || this.sanitize('');
  }

  @HostBinding('style.grid-area')
  get gridArea(): SafeStyle {
    return this.sanitize(this.control.style.gridArea) || this.sanitize('');
  }

  @HostBinding('style.place-self')
  get placeSelf(): SafeStyle {
    return this.sanitize(this.control.style.placeSelf) || this.sanitize('');
  }

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  sanitize(style: string): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }
}
