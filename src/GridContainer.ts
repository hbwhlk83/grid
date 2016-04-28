module Grid {
	/**
	 *
	 * @author 
	 *
	 */
	export class GridContainer extends egret.DisplayObjectContainer{
		public constructor() {
            super(); 
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddtoStage,this);
        }

        private onAddtoStage(evt: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddtoStage,this);
            this.createScene();
        }
            
        private bg: egret.Bitmap;
        private summaryBtn: egret.Bitmap;
        private back:egret.Bitmap;

        private playPanel:Grid.PlayPanel; // 主游戏界面
        private scorePanel: Grid.ScorePanel; //中奖信息页面
        private summaryPanel: Grid.SummaryPanel;   //抽奖简介
        private sharePanel: Grid.SharePanel;//分享页面
        private removeSummary: egret.Sprite;         //全屏点击消除简介
         
//    private data = [{ "id": 1,"v": 54 },
//        { "id": 3,"v": 15 },
//        { "id": 7,"v": 15 },
//        { "id": 5,"v": 10 },
//        { "id": 4,"v": 3 },
//        { "id": 6,"v": 2 },
//        { "id": 2,"v": 1 },
//        { "id": 0,"v": 0 }];
        
        private createScene():void {
            var stageW: number = this.stage.stageWidth;
            var stageH: number = this.stage.stageHeight;
            this.bg = Grid.createBitmapByName("bgImage");
            this.bg.x = (stageW - this.bg.width) / 2;
            this.bg.y = (stageH - this.bg.height) / 2;
            this.addChild(this.bg);
            
            this.back = createBitmapByName("back");
            this.back.x = 10;
            this.back.y = 10;
            this.back.scaleX = 0.7;
            this.back.scaleY = 0.7;
            this.addChild(this.back);
            this.back.touchEnabled = true;
            this.back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackHome, this);
            

            this.removeSummary = new egret.Sprite;
            this.removeSummary.graphics.beginFill(0x000000,0);
            this.removeSummary.graphics.drawRect(0,0,stageW,stageH);
            this.removeSummary.graphics.endFill();
            this.removeSummary.x = 0;
            this.removeSummary.y = 0;
            this.removeSummary.touchEnabled = true;

            this.summaryBtn = Grid.createBitmapByName("btn0");
            this.summaryBtn.x = 394 - this.summaryBtn.width / 2;
            this.summaryBtn.y = 140 - this.summaryBtn.height / 2;
            this.addChild(this.summaryBtn);
            this.summaryBtn.touchEnabled = true;
            this.summaryBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSummaryHandler,this);
            
            this.summaryPanel = new Grid.SummaryPanel;
            this.summaryPanel.x = (stageW - this.summaryPanel.width) / 2;
            this.summaryPanel.y = (stageH - this.summaryPanel.height) / 2 + 80;
            
            this.playPanel = new Grid.PlayPanel;
            this.playPanel.x = 15,
            this.playPanel.y = 235;
            this.addChild(this.playPanel);
            this.playPanel.addEventListener("stop", this.stopGame, this);
            this.playPanel.addEventListener("share", this.onShare, this);
            
            this.scorePanel = new Grid.ScorePanel;
            this.scorePanel.x = stageW / 2;
            this.scorePanel.y = 230 + this.scorePanel.height / 2;
            this.scorePanel.scaleX = 0;
            this.scorePanel.scaleY = 0;
            this.scorePanel.anchorOffsetX = this.scorePanel.width / 2;
            this.scorePanel.anchorOffsetY = this.scorePanel.height / 2;
            
            this.sharePanel = new Grid.SharePanel;
            this.sharePanel.addEventListener("cacelShare",this.onCacelShare,this);
        }

        private stopGame() :void {
            this.scorePanel.showMsg(Grid.GameData.getInstance().prize);
            this.addChild(this.scorePanel);
            var tw = egret.Tween.get(this.scorePanel);
            tw.wait(1000).to({ scaleX: 1,scaleY: 1 },1500,egret.Ease.backOut).call(this.onTouchEnable,this);
            this.update();
        }
        
        // 请求中奖信息
        private update(params?: string): void {
            var request: egret.HttpRequest = new egret.HttpRequest;
            request.withCredentials = true;
            request.responseType = egret.HttpResponseType.TEXT;
            var url: string = Grid.GameData.getInstance().lotteryurl;
            if(params)
                url += params;
            request.open(url,egret.HttpMethod.POST);
            request.send();
            request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        }

        private onGetComplete(event: egret.Event): void {
        }

        private onGetIOError(event: egret.IOErrorEvent): void {
            console.log("get error : " + event);
        }
        
        private onShare() :void {
            if (this.sharePanel.parent == this) {
                this.removeChild(this.sharePanel);
            }
            this.addChild(this.sharePanel);
        }

        private onCacelShare(event: egret.TouchEvent): void {
            this.sharePanel.removeEventListener("cancelShare",this.onCacelShare,this);
            if(this.sharePanel.parent == this) {
                this.removeChild(this.sharePanel);
            }
        }

        private onSummaryHandler(event: egret.Event) {
            this.summaryBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSummaryHandler,this);
            this.addChild(this.summaryPanel);
            this.addChild(this.removeSummary);
            this.removeSummary.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRemoveSummaryHandler,this);
        }

        private onRemoveSummaryHandler(event: egret.Event) {
            this.removeSummary.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRemoveSummaryHandler,this);
            this.summaryBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSummaryHandler,this);
            if(this.removeSummary.parent == this) {
                this.removeChild(this.removeSummary);
            }
            if(this.summaryPanel.parent == this) {
                this.removeChild(this.summaryPanel);
            }
        }
        
        private onBackHome(event:egret.TouchEvent) :void {
            this.goHome();
        }
        
        private goHome() {
            if (window.history.length > 1)
                window.history.back();
            else
                window.location.href = Grid.GameData.getInstance().homeurl;
        }

        private onTouchEnable() {
            this.scorePanel.sprBtnAgain.touchEnabled = true;
            this.scorePanel.sprBtnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackHandler,this);

            this.scorePanel.sprBtnShop.touchEnabled = true;
            this.scorePanel.sprBtnShop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackHandler,this);
        }

        private onBackHandler(event: egret.Event): void {
            if(event.target == this.scorePanel.sprBtnAgain) {
                this.scorePanel.sprBtnAgain.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackHandler,this);
                if(this.scorePanel.parent == this) {
                    this.removeChild(this.scorePanel);
                    this.scorePanel.alpha = 1;
                    this.scorePanel.scaleX = 0;
                    this.scorePanel.scaleY = 0;
                }
                
                this.addChild(this.sharePanel);   
            } else if(event.target == this.scorePanel.sprBtnShop) {
                this.scorePanel.sprBtnShop.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackHandler,this);
                //window.location.href = Grid.GameData.getInstance().homeurl;
                if (Grid.GameData.getInstance().prize > 1)
                    window.location.href = Grid.GameData.getInstance().homeurl + "#!coupon";
                else 
                    this.goHome();
            }
            
            this.playPanel.resetSprBeginState();

        }
	}
}
