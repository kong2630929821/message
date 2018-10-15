/**
* 存储特定项目独有的数据结构
*/

/**
*用户的地址信息
*/
#[primary=uid,,db=file,dbMonitor=true]
struct AddressInfo{
    uid: u32,//用户id
    addr: String//eth地址
}
