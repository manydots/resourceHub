(function (global) {
    /**
     * - PacketBuf 相关
     * - MYSQL 相关
     */

    // 从客户端封包中读取数据
    var PacketBuf_get_byte = new NativeFunction(ptr(0x858cf22), "int", ["pointer", "pointer"], { abi: "sysv" });
    var PacketBuf_get_short = new NativeFunction(ptr(0x858cfc0), "int", ["pointer", "pointer"], { abi: "sysv" });
    var PacketBuf_get_int = new NativeFunction(ptr(0x858d27e), "int", ["pointer", "pointer"], { abi: "sysv" });
    var PacketBuf_get_binary = new NativeFunction(ptr(0x858d3b2), "int", ["pointer", "pointer", "int"], { abi: "sysv" });

    // 服务器组包
    var PacketGuard_PacketGuard = new NativeFunction(ptr(0x858dd4c), "int", ["pointer"], { abi: "sysv" });
    var InterfacePacketBuf_put_header = new NativeFunction(ptr(0x80cb8fc), "int", ["pointer", "int", "int"], { abi: "sysv" });
    var InterfacePacketBuf_put_byte = new NativeFunction(ptr(0x80cb920), "int", ["pointer", "uint8"], { abi: "sysv" });
    var InterfacePacketBuf_put_short = new NativeFunction(ptr(0x80d9ea4), "int", ["pointer", "uint16"], { abi: "sysv" });
    var InterfacePacketBuf_put_int = new NativeFunction(ptr(0x80cb93c), "int", ["pointer", "int"], { abi: "sysv" });
    var InterfacePacketBuf_put_binary = new NativeFunction(ptr(0x811df08), "int", ["pointer", "pointer", "int"], { abi: "sysv" });
    var InterfacePacketBuf_finalize = new NativeFunction(ptr(0x80cb958), "int", ["pointer", "int"], { abi: "sysv" });
    var Destroy_PacketGuard_PacketGuard = new NativeFunction(ptr(0x858de80), "int", ["pointer"], { abi: "sysv" });
    var InterfacePacketBuf_clear = new NativeFunction(ptr(0x080cb8e6), "int", ["pointer"], { abi: "sysv" });
    var InterfacePacketBuf_put_packet = new NativeFunction(ptr(0x0815098e), "int", ["pointer", "pointer"], { abi: "sysv" });
    var PacketGuard_free_PacketGuard = new NativeFunction(ptr(0x0858de80), "void", ["pointer"], { abi: "sysv" });

    // 游戏中已打开的数据库索引(游戏数据库非线程安全 谨慎操作)
    var DBMgr_GetDBHandle = new NativeFunction(ptr(0x83f523e), "pointer", ["pointer", "int", "int"], { abi: "sysv" });
    var MySQL_MySQL = new NativeFunction(ptr(0x83f3ac8), "pointer", ["pointer"], { abi: "sysv" });
    var MySQL_init = new NativeFunction(ptr(0x83f3ce4), "int", ["pointer"], { abi: "sysv" });
    var MySQL_open = new NativeFunction(ptr(0x83f4024), "int", ["pointer", "pointer", "int", "pointer", "pointer", "pointer"], { abi: "sysv" });
    var MySQL_close = new NativeFunction(ptr(0x83f3e74), "int", ["pointer"], { abi: "sysv" });
    var MySQL_set_query_2 = new NativeFunction(ptr(0x83f41c0), "int", ["pointer", "pointer"], { abi: "sysv" });
    var MySQL_set_query_3 = new NativeFunction(ptr(0x83f41c0), "int", ["pointer", "pointer", "int"], { abi: "sysv" });
    var MySQL_set_query_4 = new NativeFunction(ptr(0x83f41c0), "int", ["pointer", "pointer", "int", "int"], { abi: "sysv" });
    var MySQL_set_query_5 = new NativeFunction(ptr(0x83f41c0), "int", ["pointer", "pointer", "int", "int", "int"], { abi: "sysv" });
    var MySQL_set_query_6 = new NativeFunction(ptr(0x83f41c0), "int", ["pointer", "pointer", "int", "int", "int", "int"], { abi: "sysv" });
    var MySQL_exec = new NativeFunction(ptr(0x83f4326), "int", ["pointer", "int"], { abi: "sysv" });
    var MySQL_exec_query = new NativeFunction(ptr(0x083f5348), "int", ["pointer"], { abi: "sysv" });
    var MySQL_get_n_rows = new NativeFunction(ptr(0x80e236c), "int", ["pointer"], { abi: "sysv" });
    var MySQL_fetch = new NativeFunction(ptr(0x83f44bc), "int", ["pointer"], { abi: "sysv" });
    var MySQL_get_int = new NativeFunction(ptr(0x811692c), "int", ["pointer", "int", "pointer"], { abi: "sysv" });
    var MySQL_get_short = new NativeFunction(ptr(0x0814201c), "int", ["pointer", "int", "pointer"], { abi: "sysv" });
    var MySQL_get_uint = new NativeFunction(ptr(0x80e22f2), "int", ["pointer", "int", "pointer"], { abi: "sysv" });
    var MySQL_get_ulonglong = new NativeFunction(ptr(0x81754c8), "int", ["pointer", "int", "pointer"], { abi: "sysv" });
    var MySQL_get_ushort = new NativeFunction(ptr(0x8116990), "int", ["pointer"], { abi: "sysv" });
    var MySQL_get_float = new NativeFunction(ptr(0x844d6d0), "int", ["pointer", "int", "pointer"], { abi: "sysv" });
    var MySQL_get_binary = new NativeFunction(ptr(0x812531a), "int", ["pointer", "int", "pointer", "int"], { abi: "sysv" });
    var MySQL_get_binary_length = new NativeFunction(ptr(0x81253de), "int", ["pointer", "int"], { abi: "sysv" });
    var MySQL_get_str = new NativeFunction(ptr(0x80ecdea), "int", ["pointer", "int", "pointer", "int"], { abi: "sysv" });
    var MySQL_blob_to_str = new NativeFunction(ptr(0x83f452a), "pointer", ["pointer", "int", "pointer", "int"], { abi: "sysv" });
    var compress_zip = new NativeFunction(ptr(0x86b201f), "int", ["pointer", "pointer", "pointer", "int"], { abi: "sysv" });
    var uncompress_zip = new NativeFunction(ptr(0x86b2102), "int", ["pointer", "pointer", "pointer", "int"], { abi: "sysv" });
    // 线程安全锁
    var Guard_Mutex_Guard = new NativeFunction(ptr(0x810544c), "int", ["pointer", "pointer"], { abi: "sysv" });
    var Destroy_Guard_Mutex_Guard = new NativeFunction(ptr(0x8105468), "int", ["pointer"], { abi: "sysv" });
    // 服务器内置定时器队列
    var G_TimerQueue = new NativeFunction(ptr(0x80f647c), "pointer", [], { abi: "sysv" });

    // 获取系统时间
    var CSystemTime_getCurSec = new NativeFunction(ptr(0x80cbc9e), "int", ["pointer"], { abi: "sysv" });
    var GlobalData_s_systemTime = ptr(0x941f714);

    /**获取DataManager实例 用于处理pvf的*/
    var G_CDataManager = new NativeFunction(ptr(0x80cc19b), "pointer", [], { abi: "sysv" });
    /**从pvf中获取任务数据*/
    var CDataManager_find_quest = new NativeFunction(ptr(0x835fdc6), "pointer", ["pointer", "int"], { abi: "sysv" });
    /**获取装备pvf数据*/
    var CDataManager_find_item = new NativeFunction(ptr(0x835fa32), "pointer", ["pointer", "int"], { abi: "sysv" });
    /**获取pvf数据*/
    var CDataManager_find_dungeon = new NativeFunction(ptr(0x835f9f8), "pointer", ["pointer", "int"], { abi: "sysv" });
    var CDataManager_find_monster = new NativeFunction(ptr(0x835fd84), "pointer", ["pointer", "int"], { abi: "sysv" });
    /**获取副本id*/
    var CDungeon_get_index = new NativeFunction(ptr(0x080fdcf0), "int", ["pointer"], { abi: "sysv" });
    /**获取副本名称*/
    var CDungeon_getDungeonName = new NativeFunction(ptr(0x81455a6), "pointer", ["pointer"], { abi: "sysv" });
    /**读取副本id*/
    var getDungeonIdxAfterClear = new NativeFunction(ptr(0x0867cb90), "int", ["pointer"], { abi: "sysv" });

    // 获取道具名称
    var CItem_GetItemName = new NativeFunction(ptr(0x811ed82), "int", ["pointer"], { abi: "sysv" });

    /**给角色发消息*/
    var CUser_SendNotiPacketMessage = new NativeFunction(ptr(0x86886ce), "int", ["pointer", "pointer", "int"], { abi: "sysv" });

    /**获取角色名字*/
    var CUserCharacInfo_getCurCharacName = new NativeFunction(ptr(0x8101028), "pointer", ["pointer"], { abi: "sysv" });
    /**获取当前角色id*/
    var CUserCharacInfo_getCurCharacNo = new NativeFunction(ptr(0x80cbc4e), "int", ["pointer"], { abi: "sysv" });
    /**获取角色账号id*/
    var CUser_get_acc_id = new NativeFunction(ptr(0x80da36e), "int", ["pointer"], { abi: "sysv" });
    /**获取角色所在队伍*/
    var CUser_GetParty = new NativeFunction(ptr(0x0865514c), "pointer", ["pointer"], { abi: "sysv" });
    /**获取角色等级*/
    var CUserCharacInfo_get_charac_level = new NativeFunction(ptr(0x80da2b8), "int", ["pointer"], { abi: "sysv" });
    // 发包给客户端
    var CUser_Send = new NativeFunction(ptr(0x86485ba), "int", ["pointer", "pointer"], { abi: "sysv" });

    // 装备解锁
    var CUser_OnItemUnlockWaitTimeout = new NativeFunction(ptr(0x8646912), "int", ["pointer"], { abi: "sysv" });
    var CEquipItem_make_item = new NativeFunction(ptr(0x0851098a), "pointer", ["pointer", "pointer"], { abi: "sysv" });
    var CParty_drop_item_gm = new NativeFunction(ptr(0x085a73a6), "int", ["pointer", "pointer", "int"], { abi: "sysv" });

    // 出货品级函数
    var CLuckPoint_GetItemRarity = new NativeFunction(ptr(0x8550be4), "int", ["pointer", "pointer", "int", "int"], { abi: "sysv" });
    /**检查物品冷却时间？ */
    var CUser_CheckCoolTimeItem = new NativeFunction(ptr(0x865e994), "int", ["pointer", "int"], { abi: "sysv" });
    var CParty_checkValidUser = new NativeFunction(ptr(0x8145868), "int", ["pointer", "int"], { abi: "sysv" });
    var CUser_GetCurCharacInventoryRef = new NativeFunction(ptr(0x08680f2e), "pointer", ["pointer", "int", "int"], { abi: "sysv" });

    /**---------------------------------------------------------------------------------------------------**/

    // 获取系统UTC时间(秒)
    function api_CSystemTime_getCurSec() {
        return GlobalData_s_systemTime.readInt();
    }

    /**-------------------------------------------------------服务器组包--------------------------------------------**/
    // 服务器组包
    function api_PacketGuard_PacketGuard() {
        var packet_guard = Memory.alloc(0x20000);
        PacketGuard_PacketGuard(packet_guard);
        return packet_guard;
    }

    // 从客户端封包中读取数据(失败会抛异常, 调用方必须做异常处理)
    function api_PacketBuf_get_byte(packet_buf) {
        var data = Memory.alloc(1);
        if (PacketBuf_get_byte(packet_buf, data)) {
            return data.readU8();
        }
        throw new Error("PacketBuf_get_byte Fail!");
    }

    function api_PacketBuf_get_short(packet_buf) {
        var data = Memory.alloc(2);

        if (PacketBuf_get_short(packet_buf, data)) {
            return data.readShort();
        }
        throw new Error("PacketBuf_get_short Fail!");
    }

    function api_PacketBuf_get_int(packet_buf) {
        var data = Memory.alloc(4);

        if (PacketBuf_get_int(packet_buf, data)) {
            return data.readInt();
        }
        throw new Error("PacketBuf_get_int Fail!");
    }

    function api_PacketBuf_get_binary(packet_buf, len) {
        var data = Memory.alloc(len);

        if (PacketBuf_get_binary(packet_buf, data, len)) {
            return data.readByteArray(len);
        }
        throw new Error("PacketBuf_get_binary Fail!");
    }

    // 获取原始封包数据
    function api_PacketBuf_get_buf(packet_buf) {
        return packet_buf.add(20).readPointer().add(13);
    }

    /**-------------------------------------------------------数据库--------------------------------------------**/
    // 打开数据库
    function api_MYSQL_open(db_name, db_ip, db_port, db_account, db_password) {
        // mysql初始化
        var mysql = Memory.alloc(0x80000);
        MySQL_MySQL(mysql);
        MySQL_init(mysql);
        // 连接数据库
        var db_ip_ptr = Memory.allocUtf8String(db_ip);
        var db_port = db_port;
        var db_name_ptr = Memory.allocUtf8String(db_name);
        var db_account_ptr = Memory.allocUtf8String(db_account);
        var db_password_ptr = Memory.allocUtf8String(db_password);
        var ret = MySQL_open(mysql, db_ip_ptr, db_port, db_name_ptr, db_account_ptr, db_password_ptr);
        if (ret) {
            console.error("Connect MYSQL DB <" + db_name + "> SUCCESS.");
            return mysql;
        } else {
            console.error("Connect MYSQL DB <" + db_name + "> ERROR.");
        }
        return null;
    }

    // mysql查询(返回mysql句柄)(注意线程安全)
    function api_MySQL_exec(mysql, sql) {
        var sql_ptr = Memory.allocUtf8String(sql);
        MySQL_set_query_2(mysql, sql_ptr);
        return MySQL_exec(mysql, 1);
    }

    // 查询sql结果
    // 使用前务必保证api_MySQL_exec返回0
    // 并且MySQL_get_n_rows与预期一致
    function api_MySQL_get_int(mysql, field_index) {
        var v = Memory.alloc(4);
        if (1 == MySQL_get_int(mysql, field_index, v)) return v.readInt();
        // log('api_MySQL_get_int Fail!!!');
        return null;
    }

    function api_MySQL_get_uint(mysql, field_index) {
        var v = Memory.alloc(4);
        if (1 == MySQL_get_uint(mysql, field_index, v)) return v.readUInt();
        // log('api_MySQL_get_uint Fail!!!');
        return null;
    }

    function api_MySQL_get_short(mysql, field_index) {
        var v = Memory.alloc(4);
        if (1 == MySQL_get_short(mysql, field_index, v)) return v.readShort();
        // log('MySQL_get_short Fail!!!');
        return null;
    }

    function api_MySQL_get_float(mysql, field_index) {
        var v = Memory.alloc(4);
        if (1 == MySQL_get_float(mysql, field_index, v)) return v.readFloat();
        // log('MySQL_get_float Fail!!!');
        return null;
    }

    function api_MySQL_get_str(mysql, field_index) {
        var binary_length = MySQL_get_binary_length(mysql, field_index);
        if (binary_length > 0) {
            var v = Memory.alloc(binary_length);
            if (1 == MySQL_get_binary(mysql, field_index, v, binary_length)) return v.readUtf8String(binary_length);
        }
        // log('MySQL_get_str Fail!!!');
        return null;
    }

    function api_MySQL_get_binary(mysql, field_index) {
        var binary_length = MySQL_get_binary_length(mysql, field_index);
        if (binary_length > 0) {
            var v = Memory.alloc(binary_length);
            if (1 == MySQL_get_binary(mysql, field_index, v, binary_length)) return v.readByteArray(binary_length);
        }
        // log('api_MySQL_get_binary Fail!!!');
        return null;
    }

    /**-------------------------------------------------------线程处理--------------------------------------------**/

    // 申请锁(申请后务必手动释放!!!)
    function api_Guard_Mutex_Guard() {
        var a1 = Memory.alloc(100);
        Guard_Mutex_Guard(a1, G_TimerQueue().add(16));

        return a1;
    }

    // 处理到期的自定义定时器
    function do_timer_dispatch() {
        //当前待处理的定时器任务列表
        var task_list = [];

        //线程安全
        var guard = api_Guard_Mutex_Guard();
        //依次取出队列中的任务
        while (timer_dispatcher_list.length > 0) {
            //先入先出
            var task = timer_dispatcher_list.shift();
            task_list.push(task);
        }
        Destroy_Guard_Mutex_Guard(guard);
        //执行任务
        for (var i = 0; i < task_list.length; ++i) {
            var task = task_list[i];

            var f = task[0];
            var args = task[1];
            f.apply(null, args);
        }
    }

    // 在dispatcher线程执行(args为函数f的参数组成的数组, 若f无参数args可为null)
    function api_scheduleOnMainThread(f, args) {
        // 线程安全
        var guard = api_Guard_Mutex_Guard();
        timer_dispatcher_list.push([f, args]);
        Destroy_Guard_Mutex_Guard(guard);
        return;
    }

    // 设置定时器 到期后在dispatcher线程执行
    function api_scheduleOnMainThread_delay(f, args, delay) {
        setTimeout(api_scheduleOnMainThread, delay, f, args);
    }

    /**-------------------------------------------------------游戏人物、道具相关--------------------------------------------**/
    /**获取角色名字*/
    function api_CUserCharacInfo_getCurCharacName(user) {
        var p = CUserCharacInfo_getCurCharacName(user);
        if (p.isNull()) {
            return "";
        }

        return p.readUtf8String(-1);
    }

    /**获取账号uid*/
    function api_getAccId(user) {
        return CUser_get_acc_id(user);
    }

    /**获取角色id*/
    function api_getCurCharacNo(user) {
        return CUserCharacInfo_getCurCharacNo(user);
    }

    /**获取道具名字*/
    function api_CItem_GetItemName(item_id) {
        var citem = CDataManager_find_item(G_CDataManager(), item_id);
        if (!citem.isNull()) {
            return ptr(CItem_GetItemName(citem)).readUtf8String(-1);
        }

        return item_id.toString();
    }

    /**获取当前角色所在队伍的成员数量*/
    function api_GetPartyMemberNumber(party) {
        if (party.isNull()) {
            return 1;
        }
        var MemberCnt = 0;
        for (var i = 0; i <= 3; i++) {
            MemberCnt += CParty_checkValidUser(party, i);
        }
        return MemberCnt;
    }

    /** 获取副本名字api*/
    function api_CDungeon_getDungeonName(dungeon_id) {
        var cdungeon = CDataManager_find_dungeon(G_CDataManager(), dungeon_id);
        if (!cdungeon.isNull()) {
            return ptr(CDungeon_getDungeonName(cdungeon)).readUtf8String(-1);
        }
        return dungeon_id.toString();
    }
    /**-------------------------------------------------------发送消息相关--------------------------------------------**/
    /**
     * 给角色发消息
     * 0.为上方系统公告栏 1.绿(私聊) 2/9.蓝(组队) 3/5.白(普通) 6.粉(公会) 8.橙(师徒) 14.管理员(喇叭) 16.系统消息
     * @param {*} user
     * @param {*} msg
     * @param {*} msg_type
     */
    function api_CUser_SendNotiPacketMessage(user, msg, msg_type) {
        var p = Memory.allocUtf8String(msg);
        CUser_SendNotiPacketMessage(user, p, msg_type);

        return;
    }

    // 暴露到全局
    global.api_CSystemTime_getCurSec = api_CSystemTime_getCurSec;

    global.api_PacketGuard_PacketGuard = api_PacketGuard_PacketGuard;
    global.PacketGuard_PacketGuard = PacketGuard_PacketGuard;
    global.InterfacePacketBuf_put_header = InterfacePacketBuf_put_header;
    global.InterfacePacketBuf_put_byte = InterfacePacketBuf_put_byte;
    global.InterfacePacketBuf_put_short = InterfacePacketBuf_put_short;
    global.InterfacePacketBuf_put_int = InterfacePacketBuf_put_int;
    global.InterfacePacketBuf_put_binary = InterfacePacketBuf_put_binary;
    global.InterfacePacketBuf_finalize = InterfacePacketBuf_finalize;
    global.InterfacePacketBuf_clear = InterfacePacketBuf_clear;
    global.InterfacePacketBuf_put_packet = InterfacePacketBuf_put_packet;
    global.Destroy_PacketGuard_PacketGuard = Destroy_PacketGuard_PacketGuard;

    global.Guard_Mutex_Guard = Guard_Mutex_Guard;
    global.Destroy_Guard_Mutex_Guard = Destroy_Guard_Mutex_Guard;
    global.api_PacketBuf_get_byte = api_PacketBuf_get_byte;
    global.api_PacketBuf_get_short = api_PacketBuf_get_short;
    global.api_PacketBuf_get_int = api_PacketBuf_get_int;
    global.api_PacketBuf_get_binary = api_PacketBuf_get_binary;
    global.api_PacketBuf_get_buf = api_PacketBuf_get_buf;
    global.api_Guard_Mutex_Guard = api_Guard_Mutex_Guard;
    global.do_timer_dispatch = do_timer_dispatch;
    global.api_scheduleOnMainThread = api_scheduleOnMainThread;
    global.api_scheduleOnMainThread_delay = api_scheduleOnMainThread_delay;

    global.MySQL_close = MySQL_close;
    global.api_MYSQL_open = api_MYSQL_open;
    global.api_MySQL_exec = api_MySQL_exec;
    global.api_MySQL_get_int = api_MySQL_get_int;
    global.api_MySQL_get_uint = api_MySQL_get_uint;
    global.api_MySQL_get_short = api_MySQL_get_short;
    global.api_MySQL_get_float = api_MySQL_get_float;
    global.api_MySQL_get_str = api_MySQL_get_str;
    global.api_MySQL_get_binary = api_MySQL_get_binary;

    global.CDungeon_get_index = CDungeon_get_index;
    global.CDataManager_find_item = CDataManager_find_item;
    global.CDataManager_find_monster = CDataManager_find_monster;
    global.G_CDataManager = G_CDataManager;
    global.CEquipItem_make_item = CEquipItem_make_item;
    global.CParty_drop_item_gm = CParty_drop_item_gm;
    global.CLuckPoint_GetItemRarity = CLuckPoint_GetItemRarity;
    global.CUser_GetParty = CUser_GetParty;
    global.CUser_CheckCoolTimeItem = CUser_CheckCoolTimeItem;
    global.CUser_GetCurCharacInventoryRef = CUser_GetCurCharacInventoryRef;
    global.CUser_Send = CUser_Send;
    global.CUserCharacInfo_get_charac_level = CUserCharacInfo_get_charac_level;
    global.CParty_checkValidUser = CParty_checkValidUser;

    // 发送消息相关
    global.api_CUser_SendNotiPacketMessage = api_CUser_SendNotiPacketMessage;

    // 角色相关
    global.api_CUserCharacInfo_getCurCharacName = api_CUserCharacInfo_getCurCharacName;
    global.api_getAccId = api_getAccId;
    global.api_getCurCharacNo = api_getCurCharacNo;
    global.api_GetPartyMemberNumber = api_GetPartyMemberNumber;

    // 道具相关
    global.api_CItem_GetItemName = api_CItem_GetItemName;

    // 副本相关
    global.CDungeon_getDungeonName = CDungeon_getDungeonName;
    global.api_CDungeon_getDungeonName = api_CDungeon_getDungeonName;

    global.CUser_OnItemUnlockWaitTimeout = CUser_OnItemUnlockWaitTimeout;
})(global);
