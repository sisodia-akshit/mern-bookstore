import Link from "next/link"
import "../../styles/About.css"
import MainLayout from "../layout/MainLayout"

function About() {
  return (
    <MainLayout>
      <h2 style={{ margin: "0 20px", color: "var(--primary-color)" }}>BookStore</h2>
      <div className="about">
        <img src={"https://res.cloudinary.com/dgpznnv1r/image/upload/v1768840649/books/ybwzdu0bac2gfet9fan5.avif"} alt="books" />
        <div className="aboutContent">
          <p>Welcome to BOOKERS—the first-of-its-kind book renting platform built for and by the people of your home district Bharatpur, (Raj.).</p>
          <br />
          <Link href="/books" className="btn" style={{ backgroundColor: "var(--primary-color)", color: "var(--background-color)" }}>Go Shop!!</Link>
        </div>
      </div>

      <br />
      <br />
      <br />

      <div className="AboutPage">
        <h2>About Us</h2>
        {/* <p>Welcome to BOOKERS—the first-of-its-kind book renting platform built for and by the people of your home district BHARATPUR, (Raj.).</p> */}
        {/* <br /> */}
        <p>We're more than just a library online. We’re a movement to bring stories, knowledge, and imagination within reach of every reader in our district—whether you're a student preparing for exams, a farmer curious about organic techniques, or a child discovering stories that spark dreams.</p>
        <br /><br />

        <h2>Why We Exist</h2>
        <p>In rural and semi-urban areas, access to books is often a luxury. We believe it shouldn't be. Our mission is simple:</p>
        <ul>
          <li>📚 Make reading affordable and accessible</li>
          <li>🤝 Bridge the literacy gap with community-powered sharing</li>
          <li>🌱 Promote a culture of learning and growth</li>
        </ul>
        <p>By bringing together generous donors, curious minds, and a simple digital platform, we’re giving stories new journeys — from shelf to hand, again and again.</p>
        <br /><br />

        <h2>How It Works</h2>
        <ul>
          <li><b>Browse & Borrow:</b> Explore our catalog from your phone or computer. Reserve a book with one click.</li>
          <li><b>Doorstep Delivery:</b> Our local volunteers or delivery partners get the book to you — fast and free.</li>
          <li><b>Read & Return:</b> Enjoy your book, then return it so someone else can dive in.</li>
        </ul>
        <br /><br />

        <h2>Built With Passion, Powered by Purpose</h2>
        <p>This project was born out of the belief that knowledge should never be gated by geography. Developed by local talent with love (and some serious backend skills!), this site is a small step toward digital inclusivity — one page at a time.</p>
      </div>
    </MainLayout>

  )
}

export default About