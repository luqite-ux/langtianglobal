# 江苏朗田网站内容维护范围

租户 `317a84d7-9b80-4785-bd97-59170f7d2472`。网站保持已通过的固定布局、响应式与客户提供的真实图像；后台只维护既定字段和集合。当前清单是接入范围，不能把“列出字段”误报为已经可以编辑或已经发布采用。正式源优先为客户工作簿、证书与专利 PDF、客户图片及已核实的站点设置。

| 正式页面与模块 | 需要维护的字段或集合 | 当前实现和前台落点 | 唯一日常入口 |
| --- | --- | --- | --- |
| 全站品牌与联系 | 公司英文全称、Logo/Favicon、电话、正式邮箱、地址、品牌色、社媒、追踪 ID | `lib/site.ts`、页头、页脚、Contact、JSON-LD；当前租户站点设置已有初值 | 站点设置 |
| 全站导航与页脚栏目 | 菜单文字和本站固定目标、页脚栏标题与链接、CTA 文字 | `lib/site.ts`、`components/site/site-header.tsx`、`site-footer.tsx` | 网站内容；品牌与联系字段仍取站点设置 |
| 首页 Banner 轮播 | 三张 Banner 的标题、说明、CTA 文字与目标、桌面/手机客户图片、alt、排序、上下架 | `lib/hero-slides.ts`、`components/home/hero-carousel.tsx`；来源 `banner/1.jpg` 至 `3.jpg` | 网站内容集合 |
| 首页材料族 | 区块标题、导语、四个分类入口的标题、说明、目标及排序 | `components/home/material-families.tsx`；分类 ID/名称来自本租户分类表 | 网站内容，分类字段仍由产品分类维护 |
| 首页代表产品 | 区块标题、导语、CTA 与引用的产品及顺序 | `components/home/representative-products.tsx`；产品名称、简介、图库来自本租户产品表 | 网站内容管理引用；产品本身由产品管理维护 |
| 首页应用入口 | 区块标题、导语、实际应用条目的标题、说明、图片、目标、排序与显隐 | `components/home/application-paths.tsx`、`lib/data/applications.ts` | 网站内容集合；应用页复用同一来源 |
| 首页制造与材料说明 | 区块标题、导语、工厂图、六条材料/工艺说明及图形标识对应文字 | `components/home/manufacturing-evidence.tsx`、`material-differentiators.tsx`；客户工厂图与工作簿事实 | 网站内容 |
| 首页证书与样品流程 | 证书区标题、导语及引用、四步询价流程标题/说明/排序、CTA | `components/home/quality-context.tsx`、`sampling-process.tsx`；证书复制品与客户 FAQ | 网站内容；证书事实由质量页同一集合维护 |
| 首页 FAQ、收尾询盘 | 区块标题、导语、可见 FAQ 引用/顺序、CTA 标题、说明与目标 | `components/home/home-faq.tsx`、`final-contact.tsx`；FAQ 正文与 FAQ 页同源 | 网站内容；FAQ 条目只在 FAQ 集合编辑 |
| About | 页面首屏标题/简介、公司事实、正文、实拍图片与 alt、认可展示、CTA、SEO | `app/about/page.tsx`；来源工作簿企业资料、客户摄影和证书 | 网站内容；法定主体和联系字段引用站点设置 |
| Manufacturing | 页面首屏、占地/建筑面积/产量/车间与产线数据项、图片组及说明、工艺文字、CTA、SEO | `app/manufacturing/page.tsx`；来源工作簿 C15–C17 与客户工厂摄影 | 网站内容 |
| Quality | 页面首屏、两份管理体系证书的标准/编号/范围/日期/图片、企业认可说明、六项专利标题与编号、提示文字、CTA、SEO | `app/quality/page.tsx`、`lib/data/certificates.ts`；来源客户证书与专利 PDF | 网站内容集合，保持文件出处与状态提示 |
| Applications | 页面首屏、应用条目标题/说明/图片、排序与显隐、CTA、SEO | `app/applications/page.tsx`、`lib/data/applications.ts`；来源客户产品描述 | 网站内容集合；首页引用同一条目 ID |
| FAQ | 页面首屏、主题名称、问答条目的问题/回答/主题/排序/显隐、CTA、SEO | `app/faq/page.tsx`、`lib/data/faqs.ts`；来源客户工作簿 FAQ，禁用保修承诺 | 网站内容集合；首页引用同一条目 ID |
| Contact | 页面首屏、表单周边说明、公司详情标题、补充说明与 SEO | `app/contact/page.tsx`；联系方式引用站点设置，询盘写入本租户询盘表 | 网站内容；联系字段只在站点设置维护，询盘只在询盘管理处理 |
| Products 列表与详情 | 分类、名称、多语言简介/详情、规格、MOQ、图库、关联产品、排序、上下架及详情 SEO；列表引导文案 | `app/products/page.tsx`、`app/products/[slug]/page.tsx`，本租户产品/分类数据层 | 产品与分类管理；列表引导文案及页面 SEO 在网站内容 |
| News 列表与详情 | 文章标题、摘要、正文、封面、日期、排序、草稿/发布与详情 SEO；列表空态及导语 | `app/news/page.tsx`、`app/news/[slug]/page.tsx`，本租户文章数据层 | 文章管理；列表导语/空态和页面 SEO 在网站内容 |

所有固定页面的 SEO 标题、描述、分享图与可见页面文案同源；产品和文章详情的 SEO 随对应记录读取。图片只允许引用本租户登记的 R2 资产；公开语言当前仅 `en`，定义仍须保留 locale 接口及未来扩展。任何客户资料未证实的能力、认证状态、价格或承诺不得由后台初始值编造。

接入验收须逐页核对已发布快照版本和真实字段显示，验证草稿、发布、恢复、媒体归属、角色权限、桌面和 390px 布局。`site-content` 定义 v1 与初始草稿已登记并回读；前台适配代码已完成本地构建，发布快照和 Production 采用仍待线上验收，此清单不能当作通过证据。
