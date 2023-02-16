const axios = require('axios');
const alipaySdk = require('../utils/alipay')
const resolve = require('../app/resolve')
const AlipayFormData = require("alipay-sdk/lib/form").default;
const { updateVip } = require('../service/user.service');

class PayController {
    async createPayment(ctx, next) {
        const { _id } = ctx.state.user;
        const { orderId, total } = ctx.request.query
        const formData = new AlipayFormData();
        formData.setMethod("get");
        formData.addField("charset", "utf-8");
        formData.addField("signType", "RSA2");
        formData.addField("notifyUrl", "http://ty3y3z.natappfree.cc/pay/notify");
        formData.addField("bizContent", {
            qrPayMode: 4,
            qrcodeWidth: 150,
            outTradeNo: orderId,
            productCode: "FAST_INSTANT_TRADE_PAY",
            totalAmount: total,// 订单总金额
            subject: "vip",// 标题
            body: _id//用户id
        })
        try {
            const res = await alipaySdk.exec(
                'alipay.trade.page.pay',
                {},
                { formData: formData }
            )
            ctx.body = resolve.json(res)
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', ctx)
        }
    }
    async notifyPayment(ctx, next) {//异步回调
        const { body, buyer_pay_amount } = ctx.request.body
        console.log(ctx.request.body)
        const res = await updateVip({ _id: body, day: (buyer_pay_amount - 2) / 14 });
        ctx.body = 'success'
    }
    async checkPayment(ctx, next) {//客户端轮询接口
        const { orderId } = ctx.request.query
        const formData = new AlipayFormData();
        formData.setMethod("get");
        formData.addField("charset", "utf-8");
        formData.addField("signType", "RSA2");
        formData.addField("bizContent", {
            outTradeNo: orderId
        })
        try {
            const check = await alipaySdk.exec(
                'alipay.trade.query',
                {},
                { formData: formData }
            )
            const res = await axios.get(check)
            const r = res.data.alipay_trade_query_response
            if (r.code === '10000') {
                switch (r.trade_status) {
                    case 'WAIT_BUYER_PAY':
                        ctx.body = resolve.success('等待付款');
                        break;
                    case 'TRADE_CLOSED':
                        ctx.body = resolve.success('交易关闭');
                        break;
                    case 'TRADE_SUCCESS':
                        ctx.body = resolve.success('交易成功');
                        break;
                    case 'TRADE_FINISHED':
                        ctx.body = resolve.success('交易结束');
                        break;
                }
            } else if (r.code === '40004') {
                ctx.body = resolve.success('交易不存在');
            }
        } catch (e) {
            console.log(e)
            ctx.app.emit('error', ctx)
        }
    }
}

module.exports = new PayController()
