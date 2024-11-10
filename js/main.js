// 浏览器搞笑标题
// start
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/image/peacock_flat.ico");
        document.title = '进一步有进一步的欢喜';
        clearTimeout(titleTime);
    }
    else {
        $('[rel="icon"]').attr('href', "/images/peacock_flat.ico");
        document.title = '谢谢来访~' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});
// end

var BootDate = new Date("2024/10/02 09:00:00");
function ShowRunTime(id) {
    var NowDate = new Date();
    var RunDateM = parseInt(NowDate - BootDate);
    var RunDays = Math.floor(RunDateM / (24 * 3600 * 1000));
    var RunHours = Math.floor(RunDateM % (24 * 3600 * 1000) / (3600 * 1000));
    var RunMinutes = Math.floor(RunDateM % (24 * 3600 * 1000) % (3600 * 1000) / (60 * 1000));
    var RunSeconds = Math.round(RunDateM % (24 * 3600 * 1000) % (3600 * 1000) % (60 * 1000) / 1000);
    var t = Math.trunc(234e8 + (NowDate - BootDate) / 1e3 * 17);
    var a = (t / 1496e5).toFixed(6);
    var RunTime = RunDays + "天" + RunHours + "时" + RunMinutes + "分" + RunSeconds + "秒";
    document.getElementById(id).innerHTML = "开始逐光之旅的第：" + RunTime + "，" + "<br>" + "现在旅行者一号距离地球" + t + "千米，约为" + a + "个天文单位🚀";
}
setInterval("ShowRunTime('RunTime')", 1000);