export const DEFAULT_TIMEOUT = 5 * 1000 * 60
export const DEFAULT_TEMPERATURE = 1.0
export const DEFAULT_CONTEXTCOUNT = 5
export const DEFAULT_MAX_TOKENS = 4096
export const SYSTEM_PROMPT_THRESHOLD = 128
export const DEFAULT_KNOWLEDGE_DOCUMENT_COUNT = 6
export const DEFAULT_KNOWLEDGE_THRESHOLD = 0.0
export const DEFAULT_WEBSEARCH_RAG_DOCUMENT_COUNT = 1
export const TOKENFLUX_HOST = 'https://tokenflux.ai'

// Messages loading configuration
export const INITIAL_MESSAGES_COUNT = 20
export const LOAD_MORE_COUNT = 20

export const MAX_CONTEXT_COUNT = 100
export const UNLIMITED_CONTEXT_COUNT = 100000

export const defaultTimeout = 5 * 1000 * 60

export const KB = 1024
export const MB = 1024 * KB
export const GB = 1024 * MB

export const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.heic']
export const videoExts = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv']
export const audioExts = ['.mp3', '.wav', '.ogg', '.flac', '.aac']
export const documentExts = ['.pdf', '.doc', '.docx', '.pptx', '.xlsx', '.odt', '.odp', '.ods']
const textExtsByCategory = new Map([
  [
    'language',
    [
      '.js',
      '.mjs',
      '.cjs',
      '.ts',
      '.jsx',
      '.tsx', // JavaScript/TypeScript
      '.py', // Python
      '.java', // Java
      '.cs', // C#
      '.cpp',
      '.c',
      '.h',
      '.hpp',
      '.cc',
      '.cxx',
      '.cppm',
      '.ipp',
      '.ixx', // C/C++
      '.php', // PHP
      '.rb', // Ruby
      '.pl', // Perl
      '.go', // Go
      '.rs', // Rust
      '.swift', // Swift
      '.kt',
      '.kts', // Kotlin
      '.scala', // Scala
      '.lua', // Lua
      '.groovy', // Groovy
      '.dart', // Dart
      '.hs', // Haskell
      '.clj',
      '.cljs', // Clojure
      '.elm', // Elm
      '.erl', // Erlang
      '.ex',
      '.exs', // Elixir
      '.ml',
      '.mli', // OCaml
      '.fs', // F#
      '.r',
      '.R', // R
      '.sol', // Solidity
      '.awk', // AWK
      '.cob', // COBOL
      '.asm',
      '.s', // Assembly
      '.lisp',
      '.lsp', // Lisp
      '.coffee', // CoffeeScript
      '.ino', // Arduino
      '.jl', // Julia
      '.nim', // Nim
      '.zig', // Zig
      '.d', // D语言
      '.pas', // Pascal
      '.vb', // Visual Basic
      '.rkt', // Racket
      '.scm', // Scheme
      '.hx', // Haxe
      '.as', // ActionScript
      '.pde', // Processing
      '.f90',
      '.f',
      '.f03',
      '.for',
      '.f95', // Fortran
      '.adb',
      '.ads', // Ada
      '.pro', // Prolog
      '.m',
      '.mm', // Objective-C/MATLAB
      '.rpy', // Ren'Py
      '.ets', // OpenHarmony,
      '.uniswap', // DeFi
      '.vy', // Vyper
      '.shader',
      '.glsl',
      '.frag',
      '.vert',
      '.gd' // Godot
    ]
  ],
  [
    'script',
    [
      '.sh', // Shell
      '.bat',
      '.cmd', // Windows批处理
      '.ps1', // PowerShell
      '.tcl',
      '.do', // Tcl
      '.ahk', // AutoHotkey
      '.zsh', // Zsh
      '.fish', // Fish shell
      '.csh', // C shell
      '.vbs', // VBScript
      '.applescript', // AppleScript
      '.au3', // AutoIt
      '.bash',
      '.nu'
    ]
  ],
  [
    'style',
    [
      '.css', // CSS
      '.less', // Less
      '.scss',
      '.sass', // Sass
      '.styl', // Stylus
      '.pcss', // PostCSS
      '.postcss' // PostCSS
    ]
  ],
  [
    'template',
    [
      '.vue', // Vue.js
      '.pug',
      '.jade', // Pug/Jade
      '.haml', // Haml
      '.slim', // Slim
      '.tpl', // 通用模板
      '.ejs', // EJS
      '.hbs', // Handlebars
      '.mustache', // Mustache
      '.twig', // Twig
      '.blade', // Blade (Laravel)
      '.liquid', // Liquid
      '.jinja',
      '.jinja2',
      '.j2', // Jinja
      '.erb', // ERB
      '.vm', // Velocity
      '.ftl', // FreeMarker
      '.svelte', // Svelte
      '.astro' // Astro
    ]
  ],
  [
    'config',
    [
      '.ini', // INI配置
      '.conf',
      '.config', // 通用配置
      '.env', // 环境变量
      '.toml', // TOML
      '.cfg', // 通用配置
      '.properties', // Java属性
      '.desktop', // Linux桌面文件
      '.service', // systemd服务
      '.rc',
      '.bashrc',
      '.zshrc', // Shell配置
      '.fishrc', // Fish shell配置
      '.vimrc', // Vim配置
      '.htaccess', // Apache配置
      '.robots', // robots.txt
      '.editorconfig', // EditorConfig
      '.eslintrc', // ESLint
      '.prettierrc', // Prettier
      '.babelrc', // Babel
      '.npmrc', // npm
      '.dockerignore', // Docker ignore
      '.npmignore',
      '.yarnrc',
      '.prettierignore',
      '.eslintignore',
      '.browserslistrc',
      '.json5',
      '.tfvars'
    ]
  ],
  [
    'document',
    [
      '.txt',
      '.text', // 纯文本
      '.md',
      '.mdx', // Markdown
      '.html',
      '.htm',
      '.xhtml', // HTML
      '.xml', // XML
      '.org', // Org-mode
      '.wiki', // Wiki
      '.tex',
      '.bib', // LaTeX
      '.rst', // reStructuredText
      '.rtf', // 富文本
      '.nfo', // 信息文件
      '.adoc',
      '.asciidoc', // AsciiDoc
      '.pod', // Perl文档
      '.1',
      '.2',
      '.3',
      '.4',
      '.5',
      '.6',
      '.7',
      '.8',
      '.9', // man页面
      '.man', // man页面
      '.texi',
      '.texinfo', // Texinfo
      '.readme',
      '.me', // README
      '.changelog', // 变更日志
      '.license', // 许可证
      '.authors', // 作者文件
      '.po',
      '.pot'
    ]
  ],
  [
    'data',
    [
      '.json', // JSON
      '.jsonc', // JSON with comments
      '.yaml',
      '.yml', // YAML
      '.csv',
      '.tsv', // 分隔值文件
      '.edn', // Clojure数据
      '.jsonl',
      '.ndjson', // 换行分隔JSON
      '.geojson', // GeoJSON
      '.gpx', // GPS Exchange
      '.kml', // Keyhole Markup
      '.rss',
      '.atom', // Feed格式
      '.vcf', // vCard
      '.ics', // iCalendar
      '.ldif', // LDAP数据交换
      '.pbtxt',
      '.map'
    ]
  ],
  [
    'build',
    [
      '.gradle', // Gradle
      '.make',
      '.mk', // Make
      '.cmake', // CMake
      '.sbt', // SBT
      '.rake', // Rake
      '.spec', // RPM spec
      '.pom',
      '.build', // Meson
      '.bazel' // Bazel
    ]
  ],
  [
    'database',
    [
      '.sql', // SQL
      '.ddl',
      '.dml', // DDL/DML
      '.plsql', // PL/SQL
      '.psql', // PostgreSQL
      '.cypher', // Cypher
      '.sparql' // SPARQL
    ]
  ],
  [
    'web',
    [
      '.graphql',
      '.gql', // GraphQL
      '.proto', // Protocol Buffers
      '.thrift', // Thrift
      '.wsdl', // WSDL
      '.raml', // RAML
      '.swagger',
      '.openapi' // API文档
    ]
  ],
  [
    'version',
    [
      '.gitignore', // Git ignore
      '.gitattributes', // Git attributes
      '.gitconfig', // Git config
      '.hgignore', // Mercurial ignore
      '.bzrignore', // Bazaar ignore
      '.svnignore', // SVN ignore
      '.githistory' // Git history
    ]
  ],
  [
    'subtitle',
    [
      '.srt',
      '.sub',
      '.ass' // 字幕格式
    ]
  ],
  [
    'log',
    [
      '.log',
      '.rpt' // 日志和报告 (移除了.out，因为通常是二进制可执行文件)
    ]
  ],
  [
    'eda',
    [
      '.v',
      '.sv',
      '.svh', // Verilog/SystemVerilog
      '.vhd',
      '.vhdl', // VHDL
      '.lef',
      '.def', // LEF/DEF
      '.edif', // EDIF
      '.sdf', // SDF
      '.sdc',
      '.xdc', // 约束文件
      '.sp',
      '.spi',
      '.cir',
      '.net', // SPICE
      '.scs', // Spectre
      '.asc', // LTspice
      '.tf', // Technology File
      '.il',
      '.ils' // SKILL
    ]
  ],
  [
    'game',
    [
      '.mtl', // Material Template Library
      '.x3d', // X3D文件
      '.gltf', // glTF JSON
      '.prefab', // Unity预制体 (YAML格式)
      '.meta' // Unity元数据文件 (YAML格式)
    ]
  ],
  [
    'other',
    [
      '.mcfunction', // Minecraft函数
      '.jsp', // JSP
      '.aspx', // ASP.NET
      '.ipynb', // Jupyter Notebook
      '.cake',
      '.ctp', // CakePHP
      '.cfm',
      '.cfc' // ColdFusion
    ]
  ]
])

export const textExts = Array.from(textExtsByCategory.values()).flat()
