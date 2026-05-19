(function (global) {
    /**
     * 建议优先加载
     * 不依赖Frida的工具函数
     */

    /**
     * 测试add函数
     */
    function add(a, b) {
        return a + b;
    }

    /**
     *  截取字符串前缀部分并与目标前缀比较
     */
    function startsWith(str, prefix) {
        // 类型安全转换：处理null/undefined/number等类型
        var s = String(str == null ? "" : str);
        var p = String(prefix == null ? "" : prefix);

        // 空前缀永远返回true
        if (p === "") return true;

        if (p.length > s.length) return false;

        return s.substring(0, p.length) === p;
    }

    /**
     * 生成随机数 包含[min, max]
     */
    function get_random_int(min, max) {
        if (min > max) throw new Error("min must be <= max");
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 本地时间戳(年月日 时分秒)
     */
    function get_timestamp() {
        var date = new Date();
        date = new Date(date.setHours(date.getHours() + 0)); //转换到本地时间
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var second = date.getSeconds().toString();
        var ms = date.getMilliseconds().toString();

        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    /**
     * 本地时间戳(年月日)
     */
    function get_date() {
        var date = new Date();
        date = new Date(date.setHours(date.getHours() + 0)); //转换到本地时间
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();

        return year + "-" + month + "-" + day;
    }

    // 暴露到全局
    global.add = add;

    global.get_timestamp = get_timestamp;
    global.get_date = get_date;
    global.get_random_int = get_random_int;
    global.startsWith = startsWith;
})(global);
