
interface Acgn {
    share: (name: string,data: string,funcname: string) => void
    toast: (msg:string) => void
    getVersion:() => number
}

interface Window {  
   acgn:Acgn;
   ga: (i,s,o?,g?,r?,a?,m?) => void;
}
