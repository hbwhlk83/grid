module Grid {
	/**
	 *
	 * @author 
	 *
	 */
	export class GameData extends egret.EventDispatcher {
        private _data: any; // 网络请求数据
        private _channel: string = null;//渠道
        private _prize: number = 1; //中奖号
    	  
//        //https://shop.acgn.adesk.com/web
//        private _homeurl: string = "http://magento.adesk.com/web"; 
//        //"http://magento.adesk.com/api/lottery/grid";
//        private _lotteryurl: string = "http://magento.adesk.com/api/lottery/grid";  
//        //https://shop.acgn.adesk.com/web/#!login/bind
//        private _bindurl: string = "http://magento.adesk.com/web/#!login/bind";
        //https://shop.acgn.adesk.com/web
        private static _homeurl: string; 
        private static _lotteryurl:string;
        private static _bindurl:string;

        public get data(): any {
            return this._data;
        }
        
        public set data(value:any) {
            this._data = value;
        }
        
        public get channel(): string {
            return this._channel;
        }
        
        public set channel(value:string) {
            this._channel = value;
        }
        
        public get prize(): number {
            return this._prize;
        }
        
        public set prize(value:number){
            this._prize = value;
        }
        
        public get homeurl():string {
            return GameData._homeurl;
        }
        
        public get lotteryurl(): string {
            return GameData._lotteryurl;
        }
        
        public get bindurl(): string {
            return GameData._bindurl;
        }
        
        public static initurl():void {      
            //"https://shop.acgn.adesk.com/web/9/";
            //http://magento.adesk.com/web
            this._homeurl = "https://shop.acgn.adesk.com/web/9/";
            console.log(this._homeurl);
            var tphomeurl = this._homeurl;
            var pos = tphomeurl.lastIndexOf("web");
            tphomeurl = tphomeurl.substring(0, pos);
            this._lotteryurl = tphomeurl + "api/lottery/grid";
            this._bindurl = this._homeurl + "#!login/bind";
        }
        
        private static _instance: GameData;

        public static getInstance(): Grid.GameData {
            if(this._instance == null) {
                this._instance = new Grid.GameData();
                this.initurl();
            }
            return this._instance;
        }    
	}
}
