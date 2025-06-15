/**
 * Page情報
 */

const PAGE_INFOS = [
  {pageName:"login",pageTitle:"ログイン",pageUrl:""},
  {pageName:"projectList",pageTitle:"プロジェクト一覧",pageUrl:""},
  {pageName:"projectDetail",pageTitle:"プロジェクト詳細",pageUrl:""}
] as const;

export PageInfo = typeof PAGE_INFOS(number);
export PageName = PageInfo("pageName");
export PageTitle = PageInfo("pageTitle");
export PageUrl = PageInfo("pageUrl");


