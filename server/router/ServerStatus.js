const router = require('express').Router();
const nodeCmd = require('node-cmd');
const os = require('os-utils');
const http = require('http');
const WebSocket = require('ws');

// 定义一下服务的常量信息
serverInfo = {
    cpuUsage: 0,
    totalMem: 0,
    freeMem: 0,
    gpuUsage: 0,
}

// 获取内存情况
async function getMemInfo() {
    serverInfo.totalMem = os.totalmem();
    serverInfo.freeMem = os.freemem();
}

// 获取CPU使用率
async function getCpuUsage() {
    const promise = new Promise((resolve, reject) => {
        os.cpuUsage(function (v) {
            serverInfo.cpuUsage = v;
            resolve();
        });
    });
    serverInfo.cpuUsage = await promise;
}

// 获取GPU使用率(nvidia)
async function getGpuUsage() {
    const promise = new Promise((resolve, reject) => {
        nodeCmd.get('nvidia-smi -q -d UTILIZATION', (e, b, c) => {
            if (!e) {
                let a = b.split('\r\n').find(s => s.indexOf('Gpu') >= 0 && s.indexOf('%') >= 0)
                let start = a.indexOf(':') + 2
                let end = a.indexOf('%') - 1
                let ss = a.substring(start, end)
                resolve(ss)
            }
        })
    })
    serverInfo.gpuUsage = await promise;
}

router.get('/getStatus', async (req, res) => {
    await getMemInfo()
    await getCpuUsage()
    await getGpuUsage()
    res.status(200).send({ "code": 200, "data": serverInfo });
    
});

module.exports = router;