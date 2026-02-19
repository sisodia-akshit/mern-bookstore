import "../../styles/Search.css"

const Search = ({ value, searchHandler, placeholder }) => {

    return (
        <div className="search ">
            <input
                className='searchInput'
                type="text"
                placeholder={placeholder}
                value={value} 
                onChange={searchHandler}
                style={{
                    height:40
                }}
            />
            {/* <div className='searchBtn' onClick={searchHandler}><i className="fa-solid fa-magnifying-glass"></i></div> */}
        </div>
    )
}

export default Search