import { NgFxModule } from './ngfx.module';

describe('NgFxModule', () => {
  let ngfxModule: NgFxModule;

  beforeEach(() => {
    ngfxModule = new NgFxModule();
  });

  it('should create an instance', () => {
    expect(ngfxModule).toBeTruthy();
  });
});
