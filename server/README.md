# 接口文档

> 作者:@SouthAki

## URL信息

> base_url:`http://localhost:3000`
>
> 根据具体的情况修改`base_url`

## 邮箱验证服务

> ### 发送验证码
>
> - 接口地址:`/api/email/send`
> - 方法:`GET`
> - 参数:`email`
>
> ### 验证二维码
>
> - 接口地址:`/api/email/verify`
> - 方法:`GET`
> - 参数:`email`,`email_code`

## 人机验证服务

> ### 生成图片验证码
>
> - 接口地址:`/api/verifyImage/generateVerifyimages`
> - 方法:`GET`
> - 参数:`client_email`
>
> ### 验证图片验证码
>
> - 接口地址:`/api/verifyImage/selectVerifyimages`
> - 方法:`GET`
> - 参数:`client_email`,`code`