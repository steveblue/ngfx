import { ButtonModule } from './button.module';

describe('ButtonModule', () => {
  let buttonModule: ButtonModule;

  beforeEach(() => {
    buttonModule = new ButtonModule();
  });

  it('should create an instance', () => {
    expect(buttonModule).toBeTruthy();
  });
});
