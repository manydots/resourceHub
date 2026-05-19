(function (global) {
    /**
     * 解决Frida中使用console.log打印中文乱码的问题
     * - 调用标准库函数打印日志
     * */

    // 基础高效版[puts]
    var putsLog = new NativeFunction(Module.findExportByName(null, "puts"), "int", ["pointer"], { abi: "sysv" });
    function SafeLog(str) {
        var buffer = Memory.alloc(str.length * 4);
        buffer.writeUtf8String(str);
        putsLog(buffer);
    }

    // "增强版"[printf] printf format格式化相对复杂 未拓展格式化≈未增强
    var printfLog = new NativeFunction(Module.findExportByName(null, "printf"), "int", ["pointer"], { abi: "sysv", varargs: true });
    function printf(message) {
        printfLog(Memory.allocUtf8String(message));
    }

    // 打印中文日志 接收多个参数
    function SafeLogs(args) {
        // 使用 arguments 对象处理所有传入参数
        var args = Array.prototype.slice.call(arguments);
        // 将每个参数转换为字符串
        var parts = [];
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            // 处理对象类型
            if (typeof arg === "object" && arg !== null) {
                try {
                    // 转换为 JSON 字符串
                    parts.push(JSON.stringify(arg));
                } catch (e) {
                    // 转换失败 普通字符串
                    parts.push(String(arg));
                }
            } else {
                parts.push(String(arg));
            }
        }
        // 拼接本地系统时间
        var str = get_timestamp() + "[Log] " + parts.join(" ");

        // 分配内存并写入字符串
        var buffer = Memory.alloc(str.length * 4);
        buffer.writeUtf8String(str);
        putsLog(buffer);
    }

    var writeColorLog = new NativeFunction(Module.findExportByName(null, "write"), "int", ["int", "pointer", "int"], { abi: "sysv" }); // 颜色日志

    // 带颜色输出日志
    function SafeLogEfficient(str, colorCode) {
        // 颜色代码
        var colors = {
            reset: "0",
            bold: "1",
            red: "31",
            green: "32",
            yellow: "33",
            blue: "34",
            magenta: "35",
            cyan: "36",
            white: "37",
            bgRed: "41",
            bgGreen: "42",
            bgYellow: "43"
        };

        // 处理颜色别名
        if (colors[colorCode]) {
            colorCode = colors[colorCode];
        }

        // 构建带颜色的字符串
        // var coloredStr = `\x1b[${colorCode}m${str}\x1b[0m\n`;
        var coloredStr = "\x1b[" + colorCode + "m" + get_timestamp() + "[Log] " + str + "\x1b[0m\n";

        // 计算UTF-8字节长度
        var byteLength = 0;
        for (var i = 0; i < coloredStr.length; i++) {
            var code = coloredStr.charCodeAt(i);
            byteLength += code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0xd800 || code >= 0xe000 ? 3 : 4;
            if (code >= 0xd800 && code < 0xdc00) i++; // 跳过代理对
        }

        // 分配内存并写入
        var buffer = Memory.alloc(byteLength);
        var offset = 0;

        for (var i = 0; i < coloredStr.length; i++) {
            var code = coloredStr.charCodeAt(i);

            if (code < 0x80) {
                buffer.add(offset++).writeU8(code);
            } else if (code < 0x800) {
                buffer.add(offset++).writeU8(0xc0 | (code >> 6));
                buffer.add(offset++).writeU8(0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
                buffer.add(offset++).writeU8(0xe0 | (code >> 12));
                buffer.add(offset++).writeU8(0x80 | ((code >> 6) & 0x3f));
                buffer.add(offset++).writeU8(0x80 | (code & 0x3f));
            } else {
                // 四字节字符处理
                i++;
                var next = coloredStr.charCodeAt(i);
                var full = ((code & 0x3ff) << 10) + (next & 0x3ff) + 0x10000;
                buffer.add(offset++).writeU8(0xf0 | (full >> 18));
                buffer.add(offset++).writeU8(0x80 | ((full >> 12) & 0x3f));
                buffer.add(offset++).writeU8(0x80 | ((full >> 6) & 0x3f));
                buffer.add(offset++).writeU8(0x80 | (full & 0x3f));
            }
        }
        writeColorLog(1, buffer, byteLength);
    }

    // TODO... 其他核心代码

    // 暴露到全局
    global.SafeLog = SafeLog;
    global.printf = printf;
    global.SafeLogs = SafeLogs;
    global.SafeLogEfficient = SafeLogEfficient;
})(global);
