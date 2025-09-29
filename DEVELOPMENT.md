# Development Guide - 24to12Converter

## HTML Linting Process 🔍

**所有HTML文件的创建和修改后都必须执行linting过程！**

### Automated Linting Script

使用项目根目录的 `lint-html.sh` 脚本：

```bash
./lint-html.sh
```

这个脚本会自动检查：
- `index.html` (English version)
- `de/index.html` (German version)
- `military-time-converter/index.html`
- `time-chart/index.html`
- `sitemap.xml` 格式验证

### Manual Linting

如果需要单独检查某个文件：

```bash
# 安装 HTMLHint (如果还没有安装)
npm install -g htmlhint

# 检查特定文件
htmlhint index.html
htmlhint de/index.html
```

## HTML编码标准 📋

### 必须遵循的规则：

1. **自闭合标签**：所有自闭合标签必须正确闭合
   ```html
   <!-- 正确 -->
   <link rel="stylesheet" href="style.css" />
   <img src="image.jpg" alt="description" />
   <br />

   <!-- 错误 -->
   <link rel="stylesheet" href="style.css">
   <img src="image.jpg" alt="description">
   ```

2. **Doctype声明**：必须是文件的第一个内容
   ```html
   <!DOCTYPE html>
   <html lang="en">
   ```

3. **字符转义**：特殊字符必须正确转义

4. **语义化标签**：使用适当的HTML5标签

## 多语言开发指南 🌍

### 文件结构
```
24h/
├── index.html                 # 英语主页面
├── de/
│   └── index.html            # 德语页面
├── [language-code]/
│   └── index.html            # 其他语言页面
└── sitemap.xml              # 站点地图
```

### SEO要求

1. **hreflang标签**：每个语言版本都必须包含
   ```html
   <link rel="alternate" hreflang="en" href="https://www.24to12converter.com/" />
   <link rel="alternate" hreflang="de" href="https://www.24to12converter.com/de/" />
   <link rel="alternate" hreflang="x-default" href="https://www.24to12converter.com/" />
   ```

2. **本地化meta标签**
   ```html
   <title>Kostenloser 24-Stunden zu 12-Stunden Umrechner</title>
   <meta name="description" content="德语描述..." />
   <meta name="keywords" content="德语关键词..." />
   ```

3. **语言属性**：`<html lang="de">`

### 语言切换功能

每个版本都必须包含语言切换器：
- 桌面端下拉菜单
- 移动端切换选项
- 当前语言高亮显示

## 开发工作流程 🔄

### 1. 创建/修改HTML文件
```bash
# 编辑文件
code de/index.html
```

### 2. 运行Linting
```bash
./lint-html.sh
```

### 3. 修复错误
如果linting发现错误，必须全部修复后才能提交。

### 4. 测试功能
- 语言切换是否正常工作
- 链接是否正确
- 表单功能是否正常

### 5. 更新sitemap.xml
如果添加了新页面，更新sitemap.xml。

## 常见错误修复 🛠️

### 自闭合标签错误
```bash
# 错误：标签未正确闭合
<link rel="stylesheet" href="style.css">

# 修复：添加自闭合斜杠
<link rel="stylesheet" href="style.css" />
```

### 特殊字符转义
```bash
# 错误：未转义的特殊字符
<div>x > y</div>

# 修复：使用HTML实体
<div>x &gt; y</div>
```

## 部署前检查清单 ✅

- [ ] 运行 `./lint-html.sh` 无错误
- [ ] 所有语言版本的链接正常工作
- [ ] hreflang标签正确配置
- [ ] sitemap.xml已更新
- [ ] 移动端响应式设计正常
- [ ] 表单功能在所有浏览器中正常工作

## 工具安装 💿

```bash
# 安装 HTMLHint
npm install -g htmlhint

# 安装其他有用的工具
npm install -g prettier
npm install -g xmllint
```

---
**记住：代码质量是用户体验的基础！** 🚀