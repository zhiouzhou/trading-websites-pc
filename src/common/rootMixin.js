
 const mixin = {
    data() {
	    let urlHash = window.location.hash
    	let tokenArr = urlHash.split('?token=')
    	if(tokenArr&&tokenArr.length==2){
    		let token = tokenArr[1]
    		localStorage.setItem('TOKEN',token)
    	}
        return {
            isVisitor: !localStorage.getItem('TOKEN')
        }
    }
}
export default mixin