# Claude Code (Windows 可直接构建运行版)

> 本仓库是基于 2026-03-31 泄露的 Claude Code 源码进行的修复版本。
> **修复内容**：补全了所有缺失的构建配置、Stub 桩代码、Native 依赖模拟，并修正了 Windows 环境下的运行 Bug。

***

## 🚀 快速开始

任何人拿到此仓库，只需以下几步即可在 Windows 上运行：

安装依赖(需要 Bun ≥1.3.5、Node.js ≥ 24)

### 1. 安装 Bun 运行时

项目高度依赖 [Bun](https://bun.sh)。在 PowerShell 中运行：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. 下载并安装依赖

```powershell
git clone https://github.com/puppy-bai/claude-code
cd claude-code
bun install --ignore-scripts
```

### 3. 构建与运行

```powershell
# 构建正式版 (生成 dist/main.js)
bun run build

# 启动开发版交互界面
bun run dev
```

***

## 🛠️ 已修复的关键问题 (拿来即用)

为了确保“拿来即用”，本版本已预先完成了以下修复：

1. **ColorDiff 崩溃修复**: 补全了 `src/stubs/ant-packages/color-diff-napi/index.js` 中的 `render` 方法，解决了 UI 渲染时的 `is not a function` 报错。
2. **全局宏定义注入**: 在 `src/entrypoints/cli.tsx` 中自动注入了 `MACRO` 变量（版本号、构建时间等），防止运行时出现 `ReferenceError`。
3. **调试检测优化**: 修正了 `src/main.tsx` 中的 `isBeingDebugged` 逻辑，解决了在 Windows/Bun 环境下可能导致的静默退出问题。
4. **Windows 兼容性**: 优化了安装流程，避开了由于缺失 Bash 环境导致的 `postinstall` 脚本错误。

***

## 🐾 全新升级的电子宠物系统 (Buddy System)

!\[Buddy Preview]\(./figure/image.png null)
*(宠物列表与交互演示)*

!\[1775055320809]\(image/README/1775055320809.png null)

!\[1775055426445]\(image/README/1775055426445.png null)

本版本深度解锁并重构了原本隐藏在代码深处的 `/buddy` 电子宠物系统，为你提供一个常驻在终端右下角的赛博陪伴：

- **🎨 18 种物种补全**: 告别原本简单的占位符，现在支持 18 种精美的 ASCII 艺术宠物形态！完整列表包括：

```
   \^^^/         .----.       n  ____  n      n______n        /\_/\         /\    /\  
}~(______)~{    ( °  ° )      | |°  °| |     ( ×    × )      ( ·  ·)       ( ×    × ) 
}~(× .. ×)~{    (      )      |_|    |_|     (   Oo   )      (  ω  )       (   ..   ) 
  ( .--. )       `----´         |    |        `------´       (")_(")        `------´  
  (_/  \_)                                                                
  AXOLOTL         BLOB          CACTUS        CAPYBARA         CAT           CHONK   
```

````

  ```text
  /^\  /^\        __           .----.          (°>         . o  .         .----.  
 <  °  °  >     <(- )___     / °  ° \          ||        .-o-OO-o-.     ( °  ° )   
 (   ~~   )      (  ._>      |      |        _(__)_     (__________)   (______)  
  `-vvvv-´        `--´       ~`~``~`~         ^^^^        |°  °|       /\/\/\/\  
                                                          |____|     
  DRAGON          DUCK         GHOST          GOOSE       MUSHROOM      OCTOPUS   
````

```text
   /\  /\       .---.         (\__/)         .[||].        °    .--.      _,--._  
  ((@)(@))      (×>×)       ( ◉  ◉ )       [ ×  × ]        \  ( @ )    ( ·  · )   
  (  ><  )     /(   )\     =(  ..  )=       [ ==== ]         \_`--´    /[______]\  
   `----´       `---´       (")__(")        `------´        ~~~~~~~     ``    ``   
                                                                       
    OWL         PENGUIN       RABBIT          ROBOT          SNAIL        TURTLE  
```

### 💎 宠物系统深度定制与属性

| 系统       | 选项说明                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------ |
| **眼睛**   | 支持 `·` `✦` `×` `◉` `@` `°` 等多种样式，默认闪光眼 `✦`                                                       |
| **帽子**   | 无(none)、皇冠(crown)、礼帽(tophat)、螺旋桨帽(propeller)、光环(halo)、巫师帽(wizard)、毛线帽(beanie)、小鸭子(tinyduck) — 8种 |
| **稀有度**  | Common（普通 60%）/ Uncommon（罕见 25%）/ Rare（稀有 10%）/ Epic（史诗 4%）/ Legendary（传说 1%）                    |
| **闪光变异** | 随机生成，拥有特殊的 `Shiny✦` 发光标记                                                                         |

### 📊 性格属性系统 (RPG面板)

每只宠物在孵化时会根据用户的环境和输入生成 5 个独立属性值（0-100）：

- **DEBUGGING（调试力）**
- **PATIENCE（耐心）**
- **CHAOS（混乱值）**
- **WISDOM（智慧）**
- **SNARK（毒舌值）**

### 📈 属性动态成长与奖励 (Dynamic Experience & Rewards)

宠物的属性不再是生来固定的数字，而是会随着你的一言一行不断成长的**经验值**（满级 100）！

- 🐛 **DEBUGGING (修复力)**：当你前一次命令执行失败，而紧接着下一次执行成功时（也就是修复了一个 Bug），`DEBUGGING` 会增加！满级解锁专属帽子：**光环 (halo)** 👼。
- ⏳ **PATIENCE (耐心)**：当你执行了一个耗时较长的命令（超过 10 秒钟）并成功时，宠物会佩服你的等待，`PATIENCE` 会增加！满级解锁专属帽子：**皇冠 (crown)** 👑。
- 💥 **CHAOS (混沌)**：每当你在终端中执行出报错时，宠物的混沌值 `CHAOS` 就会增加！满级解锁专属帽子：**竹蜻蜓 (propeller)** 🚁。
- **🎩 自由换装系统**:
  - 支持 **8 种帽子** (展示如下):
    ```text
    crown(皇冠)    tophat(礼帽)   propeller(螺旋桨) halo(光环)    wizard(巫师帽) beanie(无边帽) tinyduck(小鸭子)
      \^^^/         [___]          -+-            (   )          /^\           (___)           ,>   
    ```
- 支持 **7 种眼睛**（包括单宽防偏移的 `*`, `o`, `@`，以及闪光眼 `✦`）。
- 使用 `/buddy set species <物种>` 或 `/buddy set hat <帽子>` 随时随地给你的宠物换装！
- **✨ 动态交互与特效**:
  - **`/buddy pet`**: 抚摸宠物，它会开心地冒出爱心 💕。
  - **`/buddy dance`**: 宠物会随着音符 ♪ ┏(・o･)┛♪ 跳起舞来。
  - **`/buddy sleep`**: 宠物进入打盹状态，头上飘出 Zzz 气泡。
  - **`/buddy happy`**: 宠物开心庆祝，并伴有逐帧展现的烟花爆炸特效 💥。
  - **`/buddy wave`**: 宠物会向你挥手 👋 打招呼！
    （除pet以外，其余动态交互暂时注释，尚未优化）
- **🖥️ 终端常驻展示**:
  - 彻底移除了原版强制隐藏宠物的限制开关。
  - 修复了终端双宽字符导致的宠物耳朵、身体偏移问题，确保 ASCII 图形完美对齐。
  - 采用极简纯白线稿风格渲染，不喧宾夺主。
  - 使用 `/buddy off` 可以让宠物隐藏休息，使用 `/buddy on` 则伴随绚丽烟花特效重新登场！

### 🔄 状态联动反馈 (State Feedback)

让宠物成为真正的“结对编程”伙伴，它会感知你的开发状态：

- 💤 **闲置睡眠机制**：当你长时间未敲击键盘（超过 5 分钟）时，宠物会感到无聊并开始打呼噜（进入睡眠状态，眼睛闭上），并在头上飘出 Zzz 气泡。
- 😲 **敲击惊醒**：当宠物正在睡觉时，只要你敲击任何按键，气泡就会呈现“破碎”动画，宠物立刻惊醒投入工作。
- 🎉 **命令结果反馈**：当你在终端执行代码命令（如 `! npm run build`）成功后，宠物会展示开心的表情（眼睛变成 `^`）并撒花庆祝（气泡冒出 `🎉 成功啦！`）。
- 😨 **报错识别与中文翻译**：如果命令执行遇到报错（抛出 Error），宠物会做出惊恐或害怕的表情（眼睛变成 `><`），并且它会**自动提取核心报错信息**（如 "command not found"、"permission denied"），并将其翻译为简短易懂的中文（如 `🪖 命令不存在`、`🪖 没有权限`）在气泡中提示你！

### 💡 代码小助手 (Code Assistant Tips)

宠物不仅仅是个摆设，更是你的贴心助手：

- 💬 **随机温馨提示**：在宠物闲置陪伴你时，它会偶尔（每隔一段时间）弹出一个小气泡，向你分享实用的 Git 技巧、终端快捷键，或者提醒你“喝口水吧，保持水分充足能让大脑更灵活！”。

### 📜 电子宠物完整指令列表

你可以直接在终端中输入以下命令与宠物交互（支持**按** **`Tab`** **键自动补全**！）：

| 指令                        | 说明                                                   |
| ------------------------- | ---------------------------------------------------- |
| `/buddy on`               | 唤醒并显示电子宠物（伴随出现特效）。                                   |
| `/buddy off`              | 隐藏电子宠物，让它休息。                                         |
| `/buddy list`             | 查看包含 18 种物种、所有帽子与眼睛配置的完整图鉴。                          |
| `/buddy set species <名字>` | 更改物种（例如 `/buddy set species cat`）。                   |
| `/buddy set hat <名字>`     | 佩戴帽子（例如 `/buddy set hat crown`，移除可用 `none`）。         |
| `/buddy set eye <符号>`     | 更换眼睛（支持 `*`, `o`, `@`, `✦` 等，也可以直接输入 `star` 代表 `✦`）。 |
| `/buddy set name <名字>`    | 给你的宠物重新起一个名字。                                        |
| `/buddy pet`              | 抚摸宠物。                                                |
| `/buddy wave`             | 宠物向你挥手。                                              |
| `/buddy sleep`            | 让宠物睡觉。                                               |
| `/buddy dance`            | 让宠物跳舞。                                               |
| `/buddy happy`            | 触发开心庆祝动画。                                            |

***

## ⚠️ 注意事项 (网络与 API)

- **API Key**: 运行前请确保已设置环境变量 `ANTHROPIC_API_KEY`。
- **使用第三方 API**: 如果您想使用 OpenAI、DeepSeek 等其他模型，可以使用 [cc-switch](https://github.com/farion1231/cc-switch) 工具进行快速切换。
- **网络代理**: 如果你在国内环境运行，启动时若提示 `Unable to connect to Anthropic services`，请在终端设置代理：
  ```powershell
  $env:HTTP_PROXY="http://127.0.0.1:您的代理端口"
  $env:HTTPS_PROXY="http://127.0.0.1:您的代理端口"
  ```

```

- **强制跳过网络检查**: 如果需要彻底跳过启动时的域名预检，可修改 `src/utils/preflightChecks.tsx`，让 `checkEndpoints` 直接返回 `success: true`。

---

## 📂 项目结构与核心文件说明

### 1. 运行与构建文件

- **`dist/main.js`**: 构建后生成的最终可执行文件（约 20MB），包含所有依赖。可以直接通过 `bun dist/main.js` 运行。
- **`src/entrypoints/cli.tsx`**: CLI 入口，负责 `MACRO` 注入、环境初始化及启动核心逻辑。
- **`src/main.tsx`**: 核心 Agent 循环逻辑，管理对话流程与工具调用。

### 2. 关键系统模块

- **`src/QueryEngine.ts`**: 处理与 Anthropic API 的底层通信及上下文管理。
- **`src/tools/`**: 包含 40+ 自动化工具，如 `BashTool` (执行 Shell)、`FileEditTool` (精准代码编辑)。
- **`src/memdir/`**: 智能体内存系统，持久化存储项目知识和用户偏好。
- **`src/stubs/`**: **关键修复目录**，存放所有缺失原生依赖的模拟实现（Stub）。

### 3. 配置与脚本

- **`package.json`**: 定义了项目依赖、构建脚本（`build`）及开发启动脚本（`dev`）。
- **`bunfig.toml`**: Bun 运行时的专属配置文件。
- **`BUILD_GUIDE.md`**: 详尽的底层修复记录，记录了所有为了让泄露版跑起来所做的改动。

---

**免责声明**: 本项目仅供安全研究与教育目的使用。本仓库为非官方版本，基于公开npm发布包source map还原，仅供研究学习。源码版权归Anthropic 所有。
```

