import { NgFxAudioPlayerModule } from './audio-player.module';

describe('NgFxAudioPlayerModule', () => {
  let audioPlayerModule: NgFxAudioPlayerModule;

  beforeEach(() => {
    audioPlayerModule = new NgFxAudioPlayerModule();
  });

  it('should create an instance', () => {
    expect(audioPlayerModule).toBeTruthy();
  });
});
