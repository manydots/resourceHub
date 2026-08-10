# DAF资源合集
> **免责声明**：本仓库及相关文档仅供学习交流使用，严禁用于任何违法、侵权、攻击或恶意用途。使用时必须遵守相关法律法规，严禁任何形式的商业用途。

## 项目结构

```
resourceHub/
├── docs/                 # 使用与部署文档
│   └── 86JP/             # 86JP 大区
│       ├── DAFLogin/     # DAFLogin 登录器文档
│       └── gateway/      # Gateway 网关部署文档
├── other/                # 其他资源
│   ├── IDA Pro 9.1/      # IDA Pro 9.1 资源（0627 / 0725 / 1031）
│   ├── Siroco/           # Siroco 大区文件（frida / home / lib / root / usr）
│   └── 大合集/            # DOF 补丁大合集
├── LICENSE
└── README.md
```

## 文档导航

| 文档 | 快捷链接 | 说明 |
|------|----------|------|
| DAFLogin 使用说明 | [docs/86JP/DAFLogin/use.md](docs/86JP/DAFLogin/use.md) | .NET WPF 登录器：账号注册/登录/改密、BAT 登录、插件加载、服务状态检测，通过 TCP+UDP+Protobuf 对接 Go 网关 |
| Gateway 部署指南 | [docs/86JP/gateway/deploy.md](docs/86JP/gateway/deploy.md) | Go 账号网关：注册/登录/改密/管理重置/健康检查，支持 TCP/UDP/WebSocket，SQLite 存储，限流与鉴权 |

## 网页版登录器

[launch-helper](https://github.com/manydots/launch-helper) —— 通过浏览器自定义协议 `LaunchHelper` 一键启动 Windows 游戏，无需安装桌面登录器。

## 其他资源

- [Cloudflare](https://developers.cloudflare.com/warp-client/get-started/windows/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/zh-hans/downloads/)
- [inifile](https://github.com/Gaaagaa/inifile)
