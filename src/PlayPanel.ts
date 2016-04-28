module Grid {
	/**
	 *
	 * @author 
	 *
	 */
	export class PlayPanel extends egret.DisplayObjectContainer {
		public constructor() {
    		super();
    		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddtoStage, this);
		}
		
		private onAddtoStage(event:egret.Event):void {
		    this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddtoStage, this);
		    this.initView();
		}
		 
        private index: number = 0;  //当前转动到哪个位置，起点位置
        private count: number = 0;  //总共有多少个位置
        private timer: number = 0;  //setTimeout的ID，用clearTimeout清除
        private speed: number = 20;	//初始转动速度
        private times: number = 0;  //转动次数
        private cycle: number = 50;	//转动基本次数：即至少需要转动多少次再进入抽奖环节
        //private prize: number = -1;	//中奖位置
        private request: egret.HttpRequest; //中奖概率请求
           
        private bgmask:egret.Bitmap;
        private touchDownBegin:egret.Texture;
        private touchUpBegin:egret.Texture;
        private sprBegin:egret.Bitmap;
        private units:egret.Sprite[] = [];
        
        private static userUrl:string = ""
        
        //统计
//        private arry = [0,0,0,0,0,0,0,0]; //中奖概率统计
//        private sum:number = 0;
//        private data = [{ "id": 1,"v": 100 },
//        { "id": 3,"v": 46 },
//        { "id": 7,"v": 31 },
//        { "id": 5,"v": 16 },
//        { "id": 4,"v": 6 },
//        { "id": 6,"v": 3 },
//        { "id": 2,"v": 1 },
//        { "id": 0,"v": 0 }];
        

		private initView():void {
            var beginx = 0;
            var beginy = 0;
            var offsetx = 150;
            var offsety = 150;
            this.createUnit("k1",beginx,beginy);
            this.createUnit("k2",beginx + offsetx,beginy);
            this.createUnit("k3",beginx + offsetx * 2,beginy);

            this.createUnit("k6",beginx + offsetx * 2,beginy + offsety);
            this.createUnit("k9",beginx + offsetx * 2,beginy + offsety * 2);

            this.createUnit("k8",beginx + offsetx,beginy + offsety * 2);
            this.createUnit("k7",beginx,beginy + offsety * 2);
            this.createUnit("k4",beginx,beginy + offsety);

            this.touchDownBegin = RES.getRes("k05s");
            this.touchUpBegin = RES.getRes("k5");
            this.sprBegin = new egret.Bitmap(this.touchUpBegin);
            this.sprBegin.x = beginx + offsetx;
            this.sprBegin.y = beginy + offsety;
            this.addChild(this.sprBegin);
            this.sprBegin.touchEnabled = true;
            this.sprBegin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startGame,this);  
            this.sprBegin.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchStartBegin,this);
            
            this.bgmask = Grid.createBitmapByName("light");   
            
//            for(var i = 0;i < this.data.length; i++) {
//                this.sum += this.data[i].v;
//           }
		}
		
		        /**
        *  获取中奖号
        */
//            private getRandomInt(min,max) {
//                return Math.floor(Math.random() * (max - min + 1)) + min;
//            }       
//            
//            private getRandom():number {
//                var random: number = this.getRandomInt(1, this.sum);
//                for(var i = 0;i < this.data.length;++i) {
//                    var value = this.data[i];
//                    if(random <= value.v) {
//                        return value.id;
//                    }
//                    else {
//                        random -= value.v;
//                    }
//                }               
//                return 1;
//            }
		
        // 改变抽奖按钮状态
        private onTouchStartBegin(event: egret.TouchEvent) {
            this.sprBegin.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchStartBegin,this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchStartCancle,this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchStartEnd,this);
            this.sprBegin.texture = this.touchDownBegin;
            event.updateAfterEvent();
        }

        private onTouchStartCancle(event: egret.TouchEvent) {
            this.$stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchStartCancle,this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onTouchStartEnd,this);
            this.sprBegin.texture = this.touchUpBegin;
            event.updateAfterEvent();
        }

        private onTouchStartEnd(event: egret.TouchEvent) {
            if(event.target != this.sprBegin) {
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onTouchStartCancle,this);
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onTouchStartEnd,this);
                this.sprBegin.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchStartBegin,this);
                this.sprBegin.texture = this.touchUpBegin;
                event.updateAfterEvent();
            }
        }
        
        public resetSprBeginState() {
            this.sprBegin.texture = this.touchUpBegin;
            this.sprBegin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startGame,this);
            this.sprBegin.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchStartBegin,this);
        }
			
        // 请求中奖信息
        public requestRadom(params?: string): void {
            var request: egret.HttpRequest = new egret.HttpRequest;
            request.withCredentials = true;
            request.responseType = egret.HttpResponseType.TEXT;
            //"http://magento.adesk.com/api/lottery/grid";
            var url: string = Grid.GameData.getInstance().lotteryurl;
            if(Grid.GameData.getInstance().channel)
                url += Grid.GameData.getInstance().channel;
            request.open(url,egret.HttpMethod.GET);
            request.send();
            request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        }

        private onGetComplete(event: egret.Event): void {
            var request = <egret.HttpRequest>event.currentTarget;
            Grid.GameData.getInstance().data = JSON.parse(request.response);
            if(this.checkState(Grid.GameData.getInstance().data)) {
                this.units[this.index].addChild(this.bgmask);
                this.roll();
            }
        }

        private onGetIOError(event: egret.IOErrorEvent): void {
            console.log("get error : " + event);
            Grid.GameData.getInstance().prize = 1;
        }
        
        private checkState(value: any): Boolean {
            if(value == null) {
                return false;
            }

            if(value.code == 0) {
                if(value.resp != null) {
                    Grid.GameData.getInstance().prize = value.resp == -1 ? 1 : value.resp;
                } else {
                    Grid.GameData.getInstance().prize = 1;
                }
                return true;
            }
            this.resetSprBeginState();
            switch(value.code) {
                case 1001: //未登陆
                case 1009: //未绑定手机
                    if(window.acgn && window.acgn.toast) {
                        window.acgn.toast("先验证手机，才可以参加抽奖哦 O.O");
                    } else {
                        window.alert("先验证手机，才可以参加抽奖哦 O.O");
                    }
                    window.location.href = Grid.GameData.getInstance().bindurl;
                    break;
                case 1005: //抽奖限定
                    if(Grid.GameData.getInstance().channel != null) {
                        if(window.acgn && window.acgn.toast) {
                            window.acgn.toast("今天运气用完了，明天又可以抽了哦");
                        } else {
                            window.alert("今天运气用完了，明天又可以抽了哦");
                        }
                    }
                    this.dispatchEvent(new egret.Event("share"));
                    break;
                case 1006:  //分享渠道错误
                    alert(value.msg);
                    break;
                case 1010:
                    if(window.acgn && window.acgn.toast) {
                        window.acgn.toast("此活动已结束");
                    } else {
                        window.alert("此活动已结束");
                    }
                    break;
                default:
                    if(window.acgn && window.acgn.toast) {
                        window.acgn.toast("网络出现错误, 请稍后重试！");
                    } else {
                        window.alert("网络出现错误，请稍后重试！");
                    }
                    break;
            }
            return false;
        }
     
        private startGame(touchEvt: egret.TouchEvent): void {
            this.sprBegin.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startGame,this);
            this.count = this.units.length;
            this.speed = 100;
            this.times = 0;
            Grid.GameData.getInstance().prize = 1;
            this.requestRadom();
                        
            //打印统计信息 
//            for(let i = 0; i < 10000;i++) {
//                this.arry[this.getRandom()]++;
//            }
//            for(let j = 0;j < 8;j++) {
//                console.log(this.arry[j]);
//            }
        }
        
        private roll() {
            this.times += 1;
            if (this.bgmask.parent == this.units[this.index])
                this.units[this.index].removeChild(this.bgmask);
            this.index += 1;
            if(this.index > this.count - 1)
                this.index = 0;
            this.units[this.index].addChild(this.bgmask);
            if(this.times > this.cycle + 10 && Grid.GameData.getInstance().prize == this.index) {
                egret.clearTimeout(this.timer);
                this.dispatchEvent(new egret.Event("stop"));
            } else {
                if(this.times < this.cycle) {
                    this.speed -= 10;
                } else if(this.times == this.cycle) {
//                    var index = Math.random() * (this.count) | 0;
//                    Grid.GameData.getInstance().prize = index;
                } else {
                    if(this.times > this.cycle + 10 && ((Grid.GameData.getInstance().prize == 0 && this.index == 7) || Grid.GameData.getInstance().prize == this.index + 1)) {
                        this.speed += 110;
                    } else {
                        this.speed += 40;
                    }
                }
                if(this.speed < 40) {
                    this.speed = 40;
                };
                this.timer = egret.setTimeout(this.roll,this,this.speed);
            }
            return false;
        }
        	
        private createUnit(name: string,x: number,y: number): void {
            var lotterunit: egret.Sprite = new egret.Sprite();
            lotterunit.x = x;
            lotterunit.y = y;
            var tt = Grid.createBitmapByName(name);
            lotterunit.addChild(tt);
            this.addChild(lotterunit);
            this.units.push(lotterunit);
        }
	}
}
