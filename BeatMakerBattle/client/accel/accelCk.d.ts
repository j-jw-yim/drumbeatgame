declare const AccelMsg_ck = "\npublic class AccelMsg {\n    float accelX;\n    float accelY;\n    float accelZ;\n\n    function float getAccelX() {\n        return accelX;\n    }\n\n    function float getAccelY() {\n        return accelY;\n    }\n\n    function float getAccelZ() {\n        return accelZ;\n    }\n\n    function void _copy(AccelMsg localMsg) {\n        localMsg.accelX => accelX;\n        localMsg.accelY => accelY;\n        localMsg.accelZ => accelZ;\n    }\n}\n";
declare const Accel_ck = "\nglobal Event _accelReading;\nglobal int _accelActive;\n\nglobal float _accelX;\nglobal float _accelY;\nglobal float _accelZ;\n\npublic class Accel extends Event {\n\n    0 => int isAccelOpen;\n    0 => int active;\n\n    string deviceName; \n\n    // AccelMsg Queue\n    AccelMsg _accelMsgQueue[0];\n\n    function string name() {\n        return deviceName;\n    }\n\n    function int openAccel(int num) {\n        if (num < 0) {\n            false => active;\n        } else {\n            \"js DeviceMotionEvent\" => deviceName;\n            true => active;\n        }\n        active => isAccelOpen => _accelActive;\n        spork ~ _accelListener();\n        return active;\n    }\n\n\n    // Pop the first AccelMsg from the queue\n    // Write it to msg and return 1\n    function int recv(AccelMsg msg) {\n        // is empty\n        if (_accelMsgQueue.size() <= 0) {\n            return 0;\n        }\n\n        // pop the first AccelMsg to msg, return true\n        _accelMsgQueue[0] @=> AccelMsg localMsg;\n        msg._copy(localMsg);    \n        _accelMsgQueue.popFront();\n        return 1;\n    }\n\n    // Accel Listener\n    // Get variables from JS and write to the AccelMsg \n    function void _accelListener() {\n        AccelMsg @ msg;\n        while(true){\n            new AccelMsg @=> msg;\n            _accelReading => now;\n\n            _accelX => msg.accelX;\n            _accelY => msg.accelY;\n            _accelZ => msg.accelZ;\n\n            _accelMsgQueue << msg;\n            this.broadcast();\n        }\n    }\n}\n";
export { AccelMsg_ck, Accel_ck };
