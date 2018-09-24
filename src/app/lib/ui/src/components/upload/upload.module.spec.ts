import { NgFxUploadModule } from './upload.module';

describe('NgFxUploadModule', () => {
  let uploadModule: NgFxUploadModule;

  beforeEach(() => {
    uploadModule = new NgFxUploadModule();
  });

  it('should create an instance', () => {
    expect(uploadModule).toBeTruthy();
  });
});
