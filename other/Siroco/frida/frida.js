/** linux文件操作 **/
var fopen = new NativeFunction(Module.getExportByName(null, "fopen"), "int", ["pointer", "pointer"], { abi: "sysv" });
var fread = new NativeFunction(Module.getExportByName(null, "fread"), "int", ["pointer", "int", "int", "int"], { abi: "sysv" });
var fclose = new NativeFunction(Module.getExportByName(null, "fclose"), "int", ["int"], { abi: "sysv" });
var opendir = new NativeFunction(Module.getExportByName(null, "opendir"), "int", ["pointer"], { abi: "sysv" });
var mkdir = new NativeFunction(Module.getExportByName(null, "mkdir"), "int", ["pointer", "int"], { abi: "sysv" });

var global_config = {};
// 需要在dispatcher线程执行的任务队列(热加载后会被清空)
var timer_dispatcher_list = [];
var INVENTORY_TYPE_BODY = 0; // 身上穿的装备
var INVENTORY_TYPE_ITEM = 1; // 物品栏
var INVENTORY_TYPE_AVARTAR = 2; // 时装栏
var TAIWAN_CAIN = 2;

// 已打开数据库句柄集合
var MySQL_Handle = {
    taiwan_cain: null,
    taiwan_cain_2nd: null,
    taiwan_billing: null,
    frida: null
};

/** linux读本地文件 **/
function api_read_file(path, mode, len) {
    var path_ptr = Memory.allocUtf8String(path);
    var mode_ptr = Memory.allocUtf8String(mode);
    var f = fopen(path_ptr, mode_ptr);

    if (f == 0) return null;

    var data = Memory.alloc(len);
    var fread_ret = fread(data, 1, len, f);

    fclose(f);

    // 返回字符串
    if (mode == "r") return data.readUtf8String(fread_ret);

    // 返回二进制buff指针
    return data;
}

// 加载外部js文件
function loadExtendScript(filePath) {
    // 读取外部js文件
    var code = api_read_file(filePath, "r", 10 * 1024 * 1024);
    // TODO 做一些兼容判断
    if (code) {
        eval(code); // 将字符串转换为可执行代码
        console.log("[" + filePath + "] Load Success.");
    } else {
        console.error("[" + filePath + "] Read Error.");
    }
}

// 加载本地配置文件(json格式)
function load_config(path) {
    var data = api_read_file(path, "r", 10 * 1024 * 1024);
    global_config = JSON.parse(data || "{}");
}

var prePath = "/frida"; // 根目录
// 加载外部js文件
loadExtendScript(prePath + "/tools.js"); // 工具函数
loadExtendScript(prePath + "/libScript.js"); // 其他frida相关函数
loadExtendScript(prePath + "/coreScript.js"); // PacketBuf|MYSQL 核心文件
// ... loadExtendScript("*.js"); // 多个文件

// ...... 其他功能代码

/**-------------------------------------------------------消息分发线程--------------------------------------------**/
// 挂接消息分发线程 确保代码线程安全
function hook_TimerDispatcher_dispatch() {
    // hook TimerDispatcher::dispatch
    // 服务器内置定时器 每秒至少执行一次
    Interceptor.attach(ptr(0x8632a18), {
        onEnter: function (args) {},
        onLeave: function (retval) {
            // 清空等待执行的任务队列
            do_timer_dispatch();
        }
    });
}

/**-------------------------------------------------------数据库初始化--------------------------------------------**/

/**
 * 获取数据库句柄
 * @param dbname
 */
function getMySQLHandle(dbname) {
    return MySQL_Handle[dbname] || null;
}

// 初始化数据库(打开数据库/建库建表/数据库字段扩展)
function init_db() {
    // 读取本地配置文件
    var config = global_config["db_config"];
    var db_ip = config.ip;
    var db_port = config.port;
    var db_account = config.account;
    var db_password = config.password;

    var db_handle = MySQL_Handle;
    var sys_db_maps = ["taiwan_cain", "taiwan_cain_2nd", "taiwan_billing"]; // 系统默认连接库

    sys_db_maps.forEach(function (dbname) {
        // 打开sys_db_maps数据库列表 数据库连接
        if (db_handle[dbname] == null) {
            db_handle[dbname] = api_MYSQL_open(dbname, db_ip, db_port, db_account, db_password);
        }
    });

    // 建库frida
    api_MySQL_exec(db_handle.taiwan_cain, "create database if not exists frida default charset utf8;");
    if (db_handle.frida == null) {
        db_handle.frida = api_MYSQL_open("frida", db_ip, db_port, db_account, db_password);
    }

    // 建表frida.dp_login
    api_MySQL_exec(
        db_handle.frida,
        "CREATE TABLE if not exists dp_login(id INT(10) not null primary key AUTO_INCREMENT, uid INT(10) default 0 not null, cid INT(10) default 0 not null, first_login_time INT(10) UNSIGNED default 0 not null, create_time DATETIME DEFAULT NULL);"
    );

    // 怪物攻城 建表frida.game_event
    api_MySQL_exec(db_handle.frida, "CREATE TABLE game_event (event_id varchar(30) NOT NULL, event_info mediumtext NULL, PRIMARY KEY (event_id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
    // 怪物攻城 载入活动数据
    // event_villageattack_load_from_db();
}

// 关闭数据库（卸载插件前调用）
function uninit_db() {
    // 怪物攻城 活动数据存档
    // event_villageattack_save_to_db();

    // 关闭数据库连接
    var db_handle = MySQL_Handle;
    Object.keys(db_handle).forEach(function (dbname) {
        if (db_handle[dbname]) {
            // 关闭数据库连接
            MySQL_close(db_handle[dbname]);
            db_handle[dbname] = null;
            console.error("Close MYSQL DB <" + dbname + "> SUCCESS.");
        }
    });
}

/**-------------------------------------------------------时装潜能开始--------------------------------------------**/
function hidden_option() {
    // 关闭系统分配属性
    Memory.protect(ptr(0x08509d49), 3, "rwx");
    ptr(0x08509d49).writeByteArray([0xeb]);

    // 下发时装潜能属性
    Memory.protect(ptr(0x08509d34), 3, "rwx");
    ptr(0x08509d34).writeUShort(get_random_int(1, 63)); // 属性(1 ~ 63)
}

function start_hidden_option() {
    Interceptor.attach(ptr(0x08509b9e), {
        onEnter: function (args) {
            hidden_option(); // go~~~
        },
        onLeave: function (retval) {}
    });

    Interceptor.attach(ptr(0x0817edec), {
        onEnter: function (args) {},
        onLeave: function (retval) {
            retval.replace(1); // return 1;
        }
    });
}
/**-------------------------------------------------------时装潜能结束--------------------------------------------**/

// 回归勇士时间设置
function setReturnWarrior(day) {
    var time = day * 86400;
    Memory.protect(ptr(0x84c753d), 32, "rwx");
    ptr(0x84c753d).writeU32(time);
}

/**
 * 判断是否为数组
 */
function isArray(str) {
    return Object.prototype.toString.call(str) === "[object Array]";
}

/**
 * 写字节、字节组
 */
function writeByteArray(p, code) {
    var address = ptr(p);
    var _code = isArray(code) ? code : [code];
    Memory.protect(address, _code.length, "rwx");
    address.writeByteArray(_code);
}

/**
 * 设置服务端等级上限
 */
function setMaxLevel(maxLevel) {
    writeByteArray(0x08360c3b, maxLevel);
    writeByteArray(0x08360c79, maxLevel);
    writeByteArray(0x08360cc4, maxLevel);
    writeByteArray(0x08662f55, maxLevel);
    writeByteArray(0x086630f3, maxLevel);
    writeByteArray(0x086638f6, maxLevel);
    writeByteArray(0x08665d28, maxLevel - 1);
    writeByteArray(0x08666e9c, maxLevel - 1);
    writeByteArray(0x0866a4a8, maxLevel - 1);
    writeByteArray(0x0866a659, maxLevel);
    writeByteArray(0x0866a929, maxLevel);
    writeByteArray(0x0866a941, maxLevel);
    writeByteArray(0x08689d4b, maxLevel - 1);
    writeByteArray(0x0868fece, maxLevel);
    writeByteArray(0x0868feda, maxLevel);
    writeByteArray(0x085bb6f0, maxLevel);
    writeByteArray(0x085bb7de, maxLevel);
}

// 修复瞬间移动药剂2749064 2680784 正常使用2600014
function Fix_TeleportItem() {
    Memory.patchCode(ptr(0x081d063a), 2, function (code) {
        var writer = new X86Writer(code, {
            pc: ptr(0x081d063a)
        });
        writer.putU8(0x7d);
        writer.putU8(Memory.readU8(ptr(0x081d063a).add(1)));
        writer.flush();
    });
}

// 烟花类道具使用
function handleUseFireworks() {
    Interceptor.attach(ptr(0x08233f38), {
        onEnter: function (args) {
            var user = args[1];
            var charac_name = api_CUserCharacInfo_getCurCharacName(user);
            var item_id = user.add(285).readU32();
            var item_name = api_CItem_GetItemName(item_id);
            api_CUser_SendNotiPacketMessage(user, "[" + charac_name + api_getAccId(user) + "," + api_getCurCharacNo(user) + "]" + "使用了道具[" + item_name + "],ID为:" + item_id, 2);
        },
        onLeave: function (retval) {}
    });
}

// 装备解锁并更新装备锁
function Cuser_sendItemUnlock(user, space, slot) {
    var Inven_Item = CUser_GetCurCharacInventoryRef(user, space, slot);
    if (Inven_Item.add(20).readU8() <= 0) {
        return;
    }
    Inven_Item.add(20).writeU8(0);
    var packet_guard = api_PacketGuard_PacketGuard();
    InterfacePacketBuf_clear(packet_guard);
    InterfacePacketBuf_put_header(packet_guard, 0, 252);
    InterfacePacketBuf_put_byte(packet_guard, space);
    InterfacePacketBuf_put_short(packet_guard, slot);
    InterfacePacketBuf_finalize(packet_guard, 1);
    CUser_Send(user, packet_guard);
    Destroy_PacketGuard_PacketGuard(packet_guard);
}

/**
 * 设置装备解锁时间
 */
function UnlockItemTime(second) {
    //std::_Rb_tree_iterator<std::pair<uchar const,stItemLockInfo>>::operator->(void)	085432CC
    Interceptor.attach(ptr(0x85432cc), {
        onEnter: function (args) {},
        onLeave: function (retval) {
            var time = retval.add(4).readU32() - 259200 + second;
            // console.log("equipment_unlock_time: " + time + "s");
            retval.add(4).writeU32(time);
        }
    });

    // // item_lock::CItemLock::DoItemUnlock(CUser *,int,int)	0854231A
    // Interceptor.attach(ptr(0x854231a), {
    //     onEnter: function (args) {
    //         this.user = args[1];
    //     },
    //     onLeave: function (retval) {
    //         second > 0 ? api_scheduleOnMainThread_delay(CUser_OnItemUnlockWaitTimeout, [this.user], 1e3 * second) : CUser_OnItemUnlockWaitTimeout(this.user);
    //     }
    // });

    Interceptor.attach(ptr(0x0854231a), {
        onEnter: function (args) {
            var user = args[1];
            var space = args[2].toInt32();
            var slot = args[3].toInt32();
            api_scheduleOnMainThread_delay(Cuser_sendItemUnlock, [user, space, slot], second * 1000);
        }
    });
}

/**
 * 修复练习模式
 * 练习模式说明by木青240427
 *
 * UltraEdit -> df_game_r修改:
 * 搜0F B6 40 11 3C 01 0F 85 C5 00 00 00
 * 改0F B6 40 11 3C 01 E9 C6 00 00 00 90
 *
 * IDA Pro
 * `Search` -> `sequence of bytes...` (快捷键Alt+B)
 * 十六进制字节 -> 勾选`Find all occurrences`
 * 搜索到首地址为"0x081C8204"
 *
 * .text:081C8204                 movzx   eax, byte ptr [eax+11h]
 * .text:081C8208                 cmp     al, 1
 * .text:081C820A                 jnz     loc_81C82D5
 * .text:081C8210                 mov     [ebp+var_78], 0
 * .text:081C8217                 jmp     loc_81C82BC
 */
function FixPracticeMode() {
    writeByteArray(0x081c8204, [0x0f, 0xb6, 0x40, 0x11, 0x3c, 0x01, 0xe9, 0xc6, 0x00, 0x00, 0x00, 0x90]);
}

// 修复绝望之塔 skip_user_apc: 为true时, 跳过每10层的UserAPC
function fix_TOD(skip_user_apc) {
    // 每日进入次数限制
    // TOD_UserState::getEnterCount

    // Interceptor.attach(ptr(0x08643872), {
    //     onEnter: function (args) {
    //         // 今日已进入次数强制清零
    //         args[0].add(0x10).writeInt(0);
    //     },
    //     onLeave: function (retval) {}
    // });

    // 每10层挑战玩家APC 服务器内角色不足10个无法进入
    if (skip_user_apc) {
        // 跳过10/20/.../90层
        // TOD_UserState::getTodayEnterLayer
        Interceptor.attach(ptr(0x0864383e), {
            onEnter: function (args) {
                // 绝望之塔当前层数
                var today_enter_layer = args[1].add(0x14).readShort();
                if (today_enter_layer % 10 == 9 && today_enter_layer > 0 && today_enter_layer < 99) {
                    // 当前层数为10的倍数时  直接进入下一层
                    args[1].add(0x14).writeShort(today_enter_layer + 1);
                }
            },
            onLeave: function (retval) {}
        });
    }

    // 修复金币异常
    // CParty::UseAncientDungeonItems
    var CParty_UseAncientDungeonItems_ptr = ptr(0x859eac2);
    var CParty_UseAncientDungeonItems = new NativeFunction(CParty_UseAncientDungeonItems_ptr, "int", ["pointer", "pointer", "pointer", "pointer"], { abi: "sysv" });
    Interceptor.replace(
        CParty_UseAncientDungeonItems_ptr,
        new NativeCallback(
            function (party, dungeon, inven_item, a4) {
                // 当前进入的地下城id
                var dungeon_index = CDungeon_get_index(dungeon);
                // 根据地下城id判断是否为绝望之塔
                if (dungeon_index >= 11008 && dungeon_index <= 11107) {
                    // 绝望之塔 不再扣除金币
                    return 1;
                }
                // 其他副本执行原始扣除道具逻辑
                return CParty_UseAncientDungeonItems(party, dungeon, inven_item, a4);
            },
            "int",
            ["pointer", "pointer", "pointer", "pointer"]
        )
    );
}

// 物品使用测试
// 0x081454B8 _DWORD __cdecl WongWork::CBossTower::handleUseItem(WongWork::CBossTower *__hidden this, CUser *, unsigned int, unsigned __int8)
function handleUseItem() {
    Interceptor.attach(ptr(0x081454b8), {
        onEnter: function (args) {},
        onLeave: function (retval) {}
    });
}

// 拦截Encryption::Encrypt
function hook_encrypt() {
    Interceptor.attach(ptr(0x848da70), {
        onEnter: function (args) {
            console.log("Encrypt:" + args[0], args[1], args[2]);
        },
        onLeave: function (retval) {}
    });
}

/**
 * 处理GM信息
 */
function hook_gm_command() {
    // HOOK Dispatcher_New_gmdebug_Command::dispatch_sig
    Interceptor.attach(ptr(0x820bbde), {
        onEnter: function (args) {
            // 获取原始封包数据
            var raw_packet_buf = api_PacketBuf_get_buf(args[2]);

            // 解析GM DEBUG命令
            var msg_len = raw_packet_buf.readInt();
            var msg = raw_packet_buf.add(4).readUtf8String(msg_len);
            var user = args[1];

            // 去除命令开头的 '//'
            msg = msg.slice(2);
            SafeLog("gm_command: " + msg);
        },
        onLeave: function (retval) {}
    });
}

/**
 * 捕获玩家游戏事件 TODO
 */
function hook_history_log() {
    Interceptor.attach(ptr(0x854f990), {
        onEnter: function (args) {
            // 解析日志内容: "18000008",18000008,D,145636,"nickname",1,72,8,0,192.168.200.1,192.168.200.1,50963,11,
            // DungeonLeave,"龍人之塔",0,0,"aabb","aabb","N/A","N/A","N/A"
            var history_log = args[1].readUtf8String(-1);
            console.log("hook_history_log: " + history_log);
        },
        onLeave: function (retval) {}
    });
}

// 角色登入登出处理
function hook_user_inout_game_world() {
    // 选择角色处理函数 Hook GameWorld::reach_game_world
    Interceptor.attach(ptr(0x86c4e50), {
        onEnter: function (args) {
            this.user = args[1];
            //console.log('[GameWorld::reach_game_world] this.user=' + this.user);
        },
        onLeave: function (retval) {
            var user = this.user;
            // 给角色发消息问候
            api_CUser_SendNotiPacketMessage(this.user, "Hello : " + api_CUserCharacInfo_getCurCharacName(this.user), 2);
        }
    });
    // 角色退出时处理函数 Hook GameWorld::leave_game_world
    Interceptor.attach(ptr(0x86c5288), {
        onEnter: function (args) {
            var user = args[1];
            //console.log('[GameWorld::leave_game_world] user=' + user);
        },
        onLeave: function (retval) {}
    });
}

// 加载主功能
function start() {
    console.log("++++++++++++++++++++ frida init ++++++++++++++++++++");
    SafeLog("Frida版本:" + Frida.version);

    load_config("/frida/frida_config.json"); // 加载本地配置文件
    api_scheduleOnMainThread(init_db, null); // 初始化数据库
    hook_TimerDispatcher_dispatch(); // 挂接消息分发线程 执行需要在主线程运行的代码

    // TODO...
    fix_TOD(true); // 绝望之塔修复
    FixPracticeMode(); // 修复练习模式
    start_hidden_option(); // 时装潜能
    handleUseFireworks(); // 烟花类道具使用
    Fix_TeleportItem(); // 修复瞬间移动药剂
    // setMaxLevel(70); // 设置服务端等级上限
    UnlockItemTime(3); // 设置3秒后装备解锁
    setReturnWarrior(15); // 15天勇士归来时间
    hook_user_inout_game_world(); // hook角色登出
    hook_gm_command();
    // hook_history_log();

    Interceptor.flush();
    console.log("++++++++++++++++++++ frida end ++++++++++++++++++++");
}

// 延迟加载插件
function awake() {
    // Hook check_argv
    Interceptor.attach(ptr(0x829ea5a), {
        onEnter: function (args) {},
        onLeave: function (retval) {
            console.error("[awake] waiting check_argv then exec start function.");
            // 等待check_argv函数执行结束 再加载插件
            start();
        }
    });
}

// 框架入口
rpc.exports = {
    init: function (stage, parameters) {
        console.log("[init] stage=" + stage + ", parameters=" + JSON.stringify(parameters));
        // 脚本加载时执行
        if (stage == "early") {
            // 首次加载插件 等待服务器初始化后再加载
            awake();
        } else {
            // 热重载:  直接加载
            start();
        }
    },
    dispose: function () {
        // 脚本卸载时执行
        uninit_db();
        console.log("-------------------- frida dispose -----------------");
    }
};
