# DAFLogin

基于 .NET Framework 4.7.2 (net472) 的 WPF 登录器，配套 Go 网关 (gateway) 通过 TCP/UDP Protobuf 协议实现账号注册/登录/修改密码/游戏启动。


## 技术栈

- **运行时**: .NET Framework 4.7.2 / x86
- **UI**: WPF + HandyControl 3.4.0 主题系统
- **打包**: Costura.Fody 6.2.0 (嵌入依赖到单一 exe)
- **序列化**: protobuf-net 3.2.46 (Protobuf 二进制协议)
- **后端**: Go 网关 (gateway)

## 协议

网关采用 TCP + UDP + Protobuf 协议：

| 传输 | 配置项 | 默认值 | 用途 |
|------|--------|:------:|------|
| TCP | `tcp_port` | 8000 | 登录/注册/改密等全部命令 |
| UDP | `udp_port` | 5056 | 服务端在线检查（仅 CMD_HEALTH） |

TCP 帧格式：`[4字节大端长度前缀][Protobuf Request/Response]`

## 功能

| 功能 | 说明 |
|------|------|
| 账号登录 | TCP 发送 `CMD_LOGIN`，返回 `launch_args` 启动游戏 |
| BAT登录 | 粘贴令牌参数直接启动游戏（跳过账号验证） |
| 注册 | TCP 发送 `CMD_REGISTER` 创建账号 |
| 修改密码 | TCP 发送 `CMD_CHANGE_PASSWORD` 修改密码 |
| 找回密码 | 占位功能（暂未开放） |
| 插件加载 | 勾选后注入 DLL 到游戏进程 |
| 调试模式 | 分配控制台窗口，输出启动器日志 |
| 服务状态检测 | 每 5s UDP 发送 `CMD_HEALTH`，指示器显示在线/离线 |

## 配置

配置文件 `DLConfig.ini`（Windows INI 格式），初次启动自动创建：

| 段 | 键 | 默认值 | 说明 |
|----|----|--------|------|
| Launcher | `GameGateway` | `127.0.0.1` | 网关 IP（纯地址，不含协议和端口） |
| Launcher | `TcpPort` | `8000` | TCP 协议端口 |
| Launcher | `UdpPort` | `5056` | UDP 健康检查端口 |
| Launcher | `GameVer` | `1.180.2.1` | 游戏版本 |
| Launcher | `DLLBlackList` | JSON 数组 | 注入黑名单 |
| Launcher | `DLLList` | `[]` | 已选插件列表 |
| Launcher | `Theme` | `light` | 主题（light/dark/auto） |
| Launcher | `DebugMode` | `false` | 调试模式 |
| Account | `UserName` | (空) | 上次登录账号 |
| Account | `Password` | (空) | 上次登录密码 |

## 启动流程

1. 主窗口启动 → 读取 INI 配置 → 初始化主题 → 首次 UDP 健康检查
2. 用户输入账号密码/令牌 → 点击登录
3. 验证服务端在线 → TCP 发送对应命令 → 获取 `launch_args`
4. 启动 `dnf.exe`（非调试/调试模式）
5. 游戏窗口出现后自动隐藏登录器
6. 游戏进程退出后关闭登录器
