import { Page, Browser, chromium } from 'playwright';

// Pageクラスの基本的な使用例
async function pageClassExample() {
  // ブラウザの起動
  const browser: Browser = await chromium.launch({
    headless: false, // UIを表示する場合はfalse
  });

  // 新しいページの作成
  const page: Page = await browser.newPage();

  // ページへのナビゲーション
  await page.goto('https://example.com');

  // ページタイトルの取得
  const title = await page.title();
  console.log('ページタイトル:', title);

  // 要素の選択と操作
  // テキスト入力
  await page.fill('input[name="search"]', 'Playwright');
  
  // ボタンクリック
  await page.click('button[type="submit"]');

  // 要素の存在を待つ
  await page.waitForSelector('.search-results');

  // テキストコンテンツの取得
  const resultText = await page.textContent('.result-item');
  console.log('検索結果:', resultText);

  // スクリーンショットの撮影
  await page.screenshot({ path: 'example-screenshot.png' });

  // ページの評価（JavaScriptの実行）
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });
  console.log('ページの寸法:', dimensions);

  // イベントリスナーの登録
  page.on('console', msg => console.log('ページコンソール:', msg.text()));
  page.on('pageerror', error => console.error('ページエラー:', error));

  // レスポンスの監視
  page.on('response', response => {
    console.log('レスポンス:', response.status(), response.url());
  });

  // フォームの操作例
  await page.type('#username', 'testuser');
  await page.type('#password', 'testpass');
  await page.press('#password', 'Enter'); // Enterキーを押す

  // 複数の要素を取得
  const links = await page.$$('a');
  console.log('リンクの数:', links.length);

  // 属性の取得
  const href = await page.getAttribute('a.link', 'href');
  console.log('リンクURL:', href);

  // ページのリロード
  await page.reload();

  // 戻る・進む
  await page.goBack();
  await page.goForward();

  // PDFとして保存
  await page.pdf({ path: 'page.pdf', format: 'A4' });

  // ローカルストレージの操作
  await page.evaluate(() => {
    localStorage.setItem('key', 'value');
  });

  // Cookieの操作
  const cookies = await page.context().cookies();
  console.log('Cookies:', cookies);

  // ネットワークリクエストのインターセプト
  await page.route('**/*.png', route => {
    console.log('画像リクエストをブロック:', route.request().url());
    route.abort();
  });

  // ダイアログの処理
  page.on('dialog', async dialog => {
    console.log('ダイアログメッセージ:', dialog.message());
    await dialog.accept();
  });

  // ファイルのアップロード
  await page.setInputFiles('input[type="file"]', './test-file.txt');

  // iframeの操作
  const frame = page.frame({ name: 'frameName' });
  if (frame) {
    await frame.click('#button-in-frame');
  }

  // 要素が表示されるまで待つ
  await page.waitForSelector('.dynamic-content', {
    state: 'visible',
    timeout: 30000
  });

  // カスタム関数で要素を待つ
  await page.waitForFunction(
    () => document.querySelector('.loading')?.textContent === 'Complete',
    { timeout: 5000 }
  );

  // モバイルデバイスのエミュレーション
  await page.setViewportSize({ width: 375, height: 667 });

  // ブラウザを閉じる
  await browser.close();
}

// 高度な使用例: ページオブジェクトモデル (POM)
class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://example.com/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.page.textContent('.error-message');
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.page.isVisible('.user-dashboard');
  }
}

// 使用例
async function pomExample() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');
  
  const isLoggedIn = await loginPage.isLoggedIn();
  console.log('ログイン成功:', isLoggedIn);
  
  await browser.close();
}

// エラーハンドリングの例
async function errorHandlingExample() {
  let browser: Browser | null = null;
  
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    
    // タイムアウトの設定
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);
    
    await page.goto('https://example.com');
    
    // 要素が見つからない場合のエラーハンドリング
    try {
      await page.click('.non-existent-element', { timeout: 5000 });
    } catch (error) {
      console.error('要素が見つかりませんでした:', error);
    }
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 実行
if (require.main === module) {
  pageClassExample()
    .then(() => console.log('完了'))
    .catch(error => console.error('エラー:', error));
}