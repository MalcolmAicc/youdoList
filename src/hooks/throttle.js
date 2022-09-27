export default function(fn,delay){
    let lastTime = 0;
    return function(){
        let newTime = (new Date()).getTime();
        if (newTime - lastTime < delay) return;
        fn.call(this);
        lastTime = newTime
    }
}