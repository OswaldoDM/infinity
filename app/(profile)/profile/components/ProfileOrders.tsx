

function ProfileOrders ({ userOrders }: { userOrders: Order[] }) {  
    return (
        <div className={`w-full h-full ${userOrders.length > 2 && 'overflow-y-scroll'}`}>          
          {userOrders.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {userOrders.map((order) => (                
                <li key={order.id} className="flex-1 bg-white rounded-2xl p-6 shadow-sm h-fit max-w-[420px] 2xl:max-w-[470px]">                  
                  <div className="space-y-4 font-inter text-sm">
                    <div className="flex justify-between">
                      <span className="text-black_secondary">Order Number</span>
                      <span className="font-semibold">#{order.id.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black_secondary">Date</span>
                      <span className="font-medium">
                        {new Date(order.order_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-black_secondary">Status</span>
                      <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs font-semibold capitalize">
                        {order.status}
                      </span>
                    </div>                    
                  </div>          
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no previous orders</p>
          )}
        </div>
    )
}

export default ProfileOrders;