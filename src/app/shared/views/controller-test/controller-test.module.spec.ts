import { ControllerTestModule } from './controller-test.module';

describe('ControllerTestModule', () => {
  let controllerTestModule: ControllerTestModule;

  beforeEach(() => {
    controllerTestModule = new ControllerTestModule();
  });

  it('should create an instance', () => {
    expect(controllerTestModule).toBeTruthy();
  });
});
