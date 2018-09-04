import { RtcModule } from './rtc.module';

describe('RtcModule', () => {
  let rtcModule: RtcModule;

  beforeEach(() => {
    rtcModule = new RtcModule();
  });

  it('should create an instance', () => {
    expect(rtcModule).toBeTruthy();
  });
});
