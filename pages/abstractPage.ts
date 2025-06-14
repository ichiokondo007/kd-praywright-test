
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }
}
