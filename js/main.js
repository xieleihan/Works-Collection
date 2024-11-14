// 定义变量
const url = 'https://api.u546322.nyat.app:26112'
// const networkUrl = 'api.u546322.nyat.app:26112' // 公网请求
// const networkUrl = 'http://localhost:3000' // 本地请求
var messageList;

// 原生Ajax
// 封装get请求(promise)
function get(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    });
}

// 封装post请求(promise)
function post(url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.send(JSON.stringify(data));
    });
}

async function updataMessageList(){
    await get(url + "/api/message/getMessageList")
        .then(res => {
            if (res.data && Array.isArray(res.data)) {
                const messageList = res.data;

                // 清空已有内容
                $('#messageList').empty();

                // 遍历数据并动态生成内容
                messageList.forEach(item => {
                    const $messageItem = $(`
                        <div class="d-flex justify-content-between w-100 border rounded mb-2 align-items-center px-3 py-3">
                            <div class="avatar">
                                <img src="${url}${item.avater}" alt="${item.username}" class="img-fluid rounded-circle" style="width:50px;height:50px;">
                            </div>
                            <div class="w-75 position-relative">
                                <p class="m-0">${item.username}</p>
                                <p class="m-0" style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;">${item.message}</p>
                                <p style="font-size:.7rem" class="m-0 position-absolute top-2 end-2 text-black-50">${item.datestr}</p>
                            </div>
                        </div>
                    `);

                    // 将生成的元素追加到 #messageList
                    $('#messageList').append($messageItem);
                });
            }
        }).catch(err => {
            console.log(err);
        });
};

async function getIpInfo() {
    await get('http://ip-api.com/json/?lang=zh-CN')
        .then(res => {
            console.log(res);
            $('#ip').text("IP地址：" + res.query);
            $('#city').text("城市：" + res.country + res.city + res.regionName);
            $('#zip').text("邮编：" + res.zip);
            $('#isp').text("运营商：" + res.isp);
        })
        .catch(err => {
            console.log(err);
        });
}

// 留言列表抢先刷新
$(async function () {
    updataMessageList();
    getIpInfo();
})

// 浏览器搞笑标题
// start
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "./image/peacock_flat.ico");
        document.title = '进一步有进一步的欢喜';
        clearTimeout(titleTime);
    }
    else {
        $('[rel="icon"]').attr('href', "./image/peacock_flat.ico");
        document.title = '谢谢来访~' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});
// end

const BootDate = new Date("2024/10/02 09:00:00");
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

// 业务代码
// start
const emailAuthentication = /^\w+(-+.\w+)*@\w+(-.\w+)*.\w+(-.\w+)*$/;

$('#inputEmail').on("input", function () {
    const emailValue = $('#inputEmail').val();
    const sendVerificationBtn = $('#sendVerification');

    if (emailValue === '') {
        sendVerificationBtn.css('color', '#ccc').css('cursor', 'not-allowed');
        sendVerificationBtn.off('click'); // 解绑点击事件
    } else {
        if (emailValue.match(emailAuthentication)) {
            sendVerificationBtn.css('color', '#0b5ed7').css('cursor', 'pointer');
            sendVerificationBtn.off('click'); // 先解绑之前绑定的点击事件
            sendVerificationBtn.one('click', async function () { // 确保只绑定一次点击事件
                console.log('发送验证码');

                // 倒计时文字效果(3min)
                let countdown = 180;
                const _this = $(this);
                _this.attr("disabled", true);
                _this.css('color', '#ccc').css('cursor', 'not-allowed');

                const timer = setInterval(function () {
                    if (countdown === 0) {
                        clearInterval(timer);
                        _this.attr("disabled", false);
                        _this.css('color', '#0b5ed7').css('cursor', 'pointer');
                        _this.text("发送验证码");
                    } else {
                        _this.text("重新发送(" + countdown + ")");
                        countdown--;
                    }
                }, 1000);

                // 发送验证码
                try {
                    const res = await get(url + '/api/email/send?email=' + emailValue);
                    console.log("res", res,res.code);
                    if (res.code === 200) {
                        const verifyRes = await get(url + '/api/verifyImage/generateVerifyimages?client_email=' + emailValue)
                        $(".verifycodeImages").attr("src", `data:image/svg+xml;base64,${btoa(verifyRes.img)}`);
                    }
                } catch (err) {
                    console.log(err);
                }
            });
        } else {
            sendVerificationBtn.css('color', '#ccc').css('cursor', 'not-allowed');
            sendVerificationBtn.off('click'); // 解绑点击事件
        }
    }
});

$('#sendMessage').on('click', async function () {
    const emailValue = $('#inputEmail').val();
    const verificationCode = $('#verifycode').val();
    const emailcode = $('#emailcode').val();
    const username = $('#username').val();
    const message = $('#message').val();

    if (emailValue === '' || verificationCode === '') {
        alert('邮箱或验证码不能为空');
        return;
    }

    try {
        const res = await post(url + '/api/message/addMessage', {
            "email": emailValue,
            "message": message,
            "username": username,
            "code": emailcode,
            "verifycode": verificationCode
        });
        console.log()
        if (res.code === 200) {
            alert('留言成功');
            updataMessageList();
            $('#inputEmail').val('');
            $('#verifycode').val('');
            $('#emailcode').val('');
            $('#username').val('');
            $('#message').val('');
        }
    } catch (err) {
        console.log(err);
        alert('留言失败');
    }
});



// end