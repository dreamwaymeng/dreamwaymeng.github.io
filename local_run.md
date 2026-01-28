要**本地实时预览 academicpages（基于 Jekyll 的 GitHub Pages 模板）的效果**，你完全可以在 **Mac 本地运行 Jekyll 开发环境**。这样你每次修改 Markdown/HTML/配置文件，就能立即在浏览器看到结果，而不用等 GitHub Actions 在线构建。

下面是最清晰、最稳定的做法（适用于 academicpages）：

---

# ✅ **一、安装本地 Jekyll 环境（Mac）**

### 1. 安装 Homebrew（如果已经有，跳过）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. 安装 Ruby（推荐 3.1.x）

GitHub Pages 官方支持的 Ruby 版本一般比较旧，但 academicpages 可以用更高版本：

```bash
brew install ruby
```

安装完成后，把 Ruby 加到 PATH：

```bash
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

# ✅ **二、安装 Bundler 和依赖**

在你的 academicpages 项目目录里（例如 `~/projects/academicpages`）

```bash
cd your_academicpages_folder
bundle install
```

如果看到 gem 缺失，则运行：

```bash
bundle update
```

---

# ✅ **三、本地运行 Jekyll 预览**

在项目根目录运行：

```bash
bundle exec jekyll serve
```

若需要看到草稿（_drafts）：

```bash
bundle exec jekyll serve --drafts
```

等启动后，打开：

```
http://127.0.0.1:4000
```

### 🔁 **支持热更新（自动刷新）**

你修改文件后，Jekyll 会自动 rebuild，浏览器刷新就能看到更新。

---




# ⭐ 典型 workflow（最推荐）

你会用到以下 3 步：

### **Step A. GitHub 上部署**

修改 → push → GitHub Actions 自动构建你的在线主页。

### **Step B. 本地快速预览**

修改本地文件 → 浏览器立即看到效果。

### **Step C. 确认无误后 push**

```bash
git add .
git commit -m "update page"
git push
```

---

# 🎁 你需要的话，我也可以帮你生成一个学术主页本地预览环境的自动启动脚本：

例如：

```bash
#!/bin/zsh
cd ~/projects/academicpages
bundle exec jekyll serve --livereload --drafts
```

## 修复ruby过新的问题

# 安装 rbenv（如果还没有）
brew install rbenv ruby-build  # macOS
# 或
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-installer | bash  # Linux

# 初始化 rbenv
rbenv init
# 按照提示将 eval "$(rbenv init - bash)" 添加到 ~/.bashrc 或 ~/.zshrc

# 重新打开终端或执行
source ~/.bashrc  # 或 source ~/.zshrc

# 安装 Ruby 3.3.0
rbenv install 3.3.0

# 设置为全局默认版本
rbenv global 3.3.0

# 验证
ruby --version  # 应该显示 ruby 3.3.0
