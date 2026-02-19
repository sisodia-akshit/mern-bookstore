import "../../styles/Orders.css"
import { useRouter } from 'next/navigation';


function OrderItemCard({ item }) {
    const router = useRouter();
    const cartItemHandler = (e) => {
        router.push(`/books/${item.book._id}`)
    }
    return (
        <div className='orderItemCard' onClick={cartItemHandler} >
            <img src={item?.coverImage} alt={item.book.title} height={120} width={120} />
        </div>
    )
}

export default OrderItemCard