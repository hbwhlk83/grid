module Grid {
	/**
	 *
	 * @author 
	 *
	 */
    export class SummaryPanel extends egret.Sprite {
        private txt: egret.TextField;
        
        private introduction: string = `活动时间：2016年4月28日~5月5日
    
抽奖说明：
    1、凡是注册并验证手机号的用户均可参与抽奖，每个ID每日可获得1次抽奖机会，分享可以额外增加一次抽奖机会。
    2、抽奖结果请以系统弹出对话框显示的中奖信息为准。
    3、实物奖品将会以商品券的形式发放，用户需要下单填写收货信息方可领奖。
    4、优惠券及现金券的有效期至2016年5月12日截止。`;
        public constructor() {
            super();
            var g: egret.Graphics = this.graphics;
            g.beginFill(0x000000,0.8);
            g.drawRect(0,0,450,300);
            g.endFill();
            this.txt = new egret.TextField();
            this.txt.width = 400;
            this.txt.height = 300;
            this.txt.textAlign = "left";
            this.txt.textColor = 0xFFFFFF;
            this.txt.size = 20;
            this.txt.y = 25;
            this.txt.text = this.introduction;
            this.addChild(this.txt);
            this.touchChildren = false;
            this.touchEnabled = false;
        }
    }
}
