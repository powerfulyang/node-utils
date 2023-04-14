# utils

## Installation

### First, install Rust

#### Linux

```bash
curl https://sh.rustup.rs -sSf | sh
```

#### Windows

official website: https://www.rust-lang.org/tools/install

### Then, install wasm-pack

#### Windows 需要额外操作

- **可能需要下载 [strawberryperl](https://strawberryperl.com/)**
- 使用 powershell 执行命令
- 开启脚本执行权限
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

#### 安装 wasm-pack

```powershell
cargo install wasm-pack
```
