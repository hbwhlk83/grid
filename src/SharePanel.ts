module Grid {
	/**
	 *
	 * @author 
	 *
	 */
	export var acgn:Acgn;
	export class SharePanel extends egret.Sprite {
		public constructor() {
    		super();
            var g: egret.Graphics = this.graphics;
            g.beginFill(0x000000, 0.5);
            g.drawRect(0,0,480,800);
            g.endFill();
    		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddtoStage, this);
		}
		
        private shareData = {
            "title": "蛋蛋奇货百万壕礼欢乐送",
            "desc": "来蛋蛋奇货，开心抽壕礼",
            "imageUrl": "http://s.adesk.com/game/gridshare/imageurl.jpg",
            "url": "http://s.adesk.com/game/gridshare/"
        }
        
        //WechatMoments Wechat, QQ, SinaWeibo ShareLink
        private shareChanels = [
            { name: "qq",label: "QQ好友",channel:"QQ"},
            { name: "wechat",label: "微信好友",channel: "Wechat"},
            { name: "timeline",label: "朋友圈",channel: "WechatMoments"},
            { name: "weibo",label: "微博",channel: "SinaWeibo"},
            { name: "link",label: "复制链接",channel: "ShareLink"}
            ];
        
        private shareButtons: egret.Sprite[] = [];
        
        public container:egret.Sprite;
        private removeShare:egret.Sprite;
        
		private onAddtoStage(event:egret.Event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddtoStage,this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
    		this.container = new egret.Sprite;
            this.container.graphics.beginFill(0xffffff);
            this.container.graphics.drawRect(0,0,480,300);
            this.container.graphics.endFill();
            this.addChild(this.container);
            
            // top line
            var topline: egret.Sprite = new egret.Sprite;
            topline.graphics.lineStyle(2,0xff0000,0.9);
            topline.graphics.moveTo(0,0);
            topline.graphics.lineTo(this.container.width,0);
            topline.graphics.endFill();
            this.container.addChild(topline);
            
            this.container.y = 800;
    		var shareChanel;
    	    for(let i = 0; i < this.shareChanels.length; i++) {
                shareChanel = this.shareChanels[i];
                var btn: egret.Sprite = this.createShareUnit(shareChanel);
                btn.x = (i % 4) * 120 + 30;
                btn.y = Math.floor(i / 4) * 100 + 20;
    	    }
    	    
    	    // add cancel
            // sperator line
            var sperator: egret.Sprite = new egret.Sprite;
            sperator.graphics.lineStyle(1, 0xe5e5e5);
            sperator.graphics.moveTo(0, 230);
            sperator.graphics.lineTo(this.container.width, 230);
            sperator.graphics.endFill();
            this.container.addChild(sperator);
            var txt:egret.TextField = new egret.TextField();
            txt.width = this.container.width;
            txt.height = 50;
            txt.textAlign = "center";
            txt.textColor = 0xff0000;
            txt.size = 24;
            txt.x = (this.container.width - txt.width)/2;
            txt.y = 250;
            txt.text = "取消";
            this.container.addChild(txt);
            txt.touchEnabled = true;
            txt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCancel, this);
            
            this.removeShare = new egret.Sprite;
            this.removeShare.graphics.beginFill(0x000000,0);
            this.removeShare.graphics.drawRect(0,0,this.stage.stageWidth, this.stage.stageHeight - 300);
            this.removeShare.graphics.endFill();
            this.removeShare.x = 0;
            this.removeShare.y = 0;
            this.removeShare.touchEnabled = true;
            this.removeShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchCancel,this);
            this.addChild(this.removeShare);
            
            var tw = egret.Tween.get(this.container);
            tw.to({ y: 500 },1000,egret.Ease.backOut).call(this.onShareTotast,this);
		}
		
        public onShareTotast() :void {
            if(Grid.GameData.getInstance().channel == null) {
                if(window.acgn && window.acgn.toast) {
                    window.acgn.toast("骚年，分享可以额外增加一次抽奖机会");
                } else {
                    window.alert("骚年，分享可以额外增加一次抽奖机会");
                }
            }
        }
		
        private onRemoveFromStage(event:egret.Event):void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddtoStage,this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
            this.container.y = 800;  
            this.shareButtons = [];
            this.container.removeChildren();
            this.removeChild(this.removeShare);
        }
		
		private createShareUnit(value:any) : egret.Sprite{
            var shareUnit: egret.Sprite = new egret.Sprite;
            shareUnit.touchEnabled = true;
            this.container.addChild(shareUnit);
            // add btn
		    var btn:egret.Bitmap = createBitmapByName(value.name);
            shareUnit.addChild(btn);
            this.shareButtons.push(shareUnit);    
            //btn.scaleX = btn.scaleY = 0.5;
            shareUnit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchShare, this);
            
            // add txt
            var txt:egret.TextField = new egret.TextField;
            txt.width = 80;
            txt.height = 20;
            txt.textAlign = "center";
            txt.textColor = 0x0000000;
            txt.size = 18;
            txt.x = (shareUnit.width - txt.width)/2;
            txt.y = shareUnit.height + txt.height/2;
            txt.text = value.label;
            shareUnit.addChild(txt);
            return shareUnit;
		}
		
        private onTouchCancel(event:egret.TouchEvent):void {
            this.dispatchEvent(new egret.Event("cacelShare"));
            //Grid.GameData.getInstance().channel = null;
        }
		
		private onTouchShare(event:egret.TouchEvent):void {
		    var tagret:egret.Sprite = event.target;
            for(let i = 0;i < this.shareButtons.length; i++) {
                if(tagret == this.shareButtons[i]) {
                    if(window.ga) {
                        window.ga('send','event','gridlottery','share_click');
                    }
                    var tchannel: string = this.shareChanels[i].channel;
                    Grid.GameData.getInstance().channel = "?channel=" + tchannel;
                    window["lotteryshared"] = function() { 
//                        if(window.acgn && window.acgn.toast) 
//                            window.acgn.toast(JSON.stringify(arguments));
//                        else 
//                            window.alert(JSON.stringify(arguments));
                    }
//                    window.alert(acgn == null ? "acgn = null" : acgn);
//                    window.alert(window.acgn == null ? "window.acgn = null" : window.acgn);
//                    window.alert(window.acgn.share == null ? "window.acgn.sharegn = null" : window.acgn.share);
                    
                    if(window.acgn && window.acgn.share) {
                        window.acgn.share(tchannel,JSON.stringify(this.shareData),"lotteryshared");
                    } else if(acgn && acgn.share) {
                        //window.alert(acgn.share == null ? "acgn.share = null" : acgn.share);
                        acgn.share(tchannel,JSON.stringify(this.shareData),"lotteryshared");
                    } else {
//                        if(window.acgn && window.acgn.toast)
//                            window.acgn.toast(Grid.GameData.getInstance().channel + "\n" + JSON.stringify(this.shareData));
//                        else
//                            window.alert(Grid.GameData.getInstance().channel + "\n" + JSON.stringify(this.shareData));
                    }   
                    
                    this.dispatchEvent(new egret.Event("cacelShare")); 
                    break;
		        }
		    }
		}
	}
}
