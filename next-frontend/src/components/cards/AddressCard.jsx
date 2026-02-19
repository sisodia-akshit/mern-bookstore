import "../../styles/AddressCard.css"

function AddressCard({ address, onClick }) {
    return (
        <div className={address.isDefault?"addressCard defaultAddressCard":`addressCard`} onClick={(e)=>onClick(address._id)}>
            <h3>{address.name}</h3>
            <p>{address.phone}</p>
            <p>{address.line1}</p>
            <p>{address.line2}</p>
            <p>{address.city}, {address.state}, {address.country}, ({address.pincode})</p>
        </div>
    )
}

export default AddressCard