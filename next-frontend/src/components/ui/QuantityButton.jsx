import React from 'react'

function QuantityButton({ quantity, setQuantity, stock }) {

    const onPlusQuantityHandler = (e) => {
        if (quantity >= stock) return
        setQuantity(quantity + 1)
    }
    const onMinusQuantityHandler = (e) => {
        if (quantity <= 1) return
        setQuantity(quantity - 1)
    }

    return (
        <div className="productQuantity">
            <span onClick={onMinusQuantityHandler} className={quantity === 1 ? "disable" : ""}><i className="fa-solid fa-minus"></i></span>
            <p style={{margin:"0"}}>{quantity}</p>
            <span onClick={onPlusQuantityHandler} className={quantity >= stock ? "disable" : ""}><i className="fa-solid fa-plus"></i></span>
        </div>
    )
}

export default QuantityButton