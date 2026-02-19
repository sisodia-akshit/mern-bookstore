import '../../styles/Footer.css'

function Footer() {

  return (
    <>
      <div className="footer ">
        <div className="footerTop ">
          <div className="footerItemA">
            <h3>
              BookStore
            </h3>
            <p>Welcome to my BookStore—the first-of-its-kind book renting platform built for and by the people of your Home District BHARATPUR, (Raj.).</p>
            <div className="socialMediaLogo">

            </div>
          </div>
          <div className="footerItemBC">
            <div className="footerItemB">
              <h5>Genres</h5>
              <div className="FooterCCategory">
                <span>Action</span>
                <span>Friction</span>
                <span>Sci-Fi</span>
                <span>Adventure</span>
                <span>Phychology</span>
                <span>Isekai</span>
              </div>
            </div>
            <div className="footerItemC">
              <h5>Support</h5>
              <div className="FooterCCategory">
                <span>Help&nbsp;&&nbsp;Support</span>
                <span>Terms&nbsp;&&nbsp;Conditions</span>
                <span>Privacy&nbsp;Policy</span>
                <span>Help</span>
              </div>
            </div>
          </div>

          {/* <div className="footerItemD">
            <h5>Newsletter</h5>
            <div className="footerQuickSubscribe">
              <input type="text" placeholder='Your email' />
              <button>Subscribe</button>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit rerum voluptatum quidem at.</p>
          </div> */}
        </div>
        <div className="footerBottom ">
          <div className="footerBottomInner ">
            <div className="footerLeft">
              <p>@ 2025 - Blogy - Designed & Developed by</p><div className="name">&nbsp;Akshit</div>
            </div>
            {/* <div className="footerRight">
              <img src={CreditCards} alt="Cards" width={180} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer