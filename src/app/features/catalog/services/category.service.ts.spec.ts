import { CategoryService } from './category.service';

describe('CategoryService', () => {
  it('should create an instance', () => {
    const directive = new CategoryService();
    expect(directive).toBeTruthy();
  });
});
