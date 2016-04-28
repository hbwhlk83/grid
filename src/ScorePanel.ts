module Grid {
	/**
	 *
	 * @author 
	 *
	 */
	export class ScorePanel extends egret.Sprite {  	
        private dataJson = [
            "",
            ["g20","g21","g22","g23","g24","g25","g26","g27","g28","g29"],
            "g3",
            "g6",
            "g9",
            "g8",
            "g7",
            "g4"
        ];
        
        private scoreMsg:string;
        public sprBtnShop:egret.Bitmap;
        public sprBtnAgain:egret.Bitmap;
		public constructor() {
            super();
            this.width = 458;
            this.height = 458;

            this.sprBtnShop = Grid.createBitmapByName("btn1");
            this.sprBtnShop.x = 126 - this.sprBtnShop.width / 2;
            this.sprBtnShop.y = 418 - this.sprBtnShop.height / 2;

            this.sprBtnAgain = Grid.createBitmapByName("btn2");
            this.sprBtnAgain.x = 333 - this.sprBtnAgain.width / 2;
            this.sprBtnAgain.y = 418 - this.sprBtnAgain.height / 2;
          
		}

		public showMsg(selected:number) :void {
            if(selected >= 0) {
                var prizes = this.dataJson[selected];
                if(typeof prizes == "object") {
                    var index = Math.random() * prizes.length | 0;
                    this.scoreMsg = prizes[index].toString();
                } else {
                    this.scoreMsg = prizes.toString();
                }
                RES.getResByUrl("resource/assets/" + this.scoreMsg + ".jpg",this.logoComplete,this,RES.ResourceItem.TYPE_IMAGE)
            }
		}
		
        private logoComplete(value: egret.Texture): void {
            if (value) {
                var gift: egret.Bitmap = new egret.Bitmap(value);
                this.addChild(gift);
                this.addChild(this.sprBtnShop);
                this.addChild(this.sprBtnAgain);
            }
        }	
	}
    
	
    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
    */
    export function createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}
