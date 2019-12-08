class error extends Error{
constructor(status,msg,error=true){
    super()
    this.error=error
    this.status=status,
    this.msg=msg
}
}
module.exports ={
    error
}