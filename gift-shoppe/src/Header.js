import React from 'react'
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';

function header() {
  return (
    <>
    <section className='header-top'>
      <div className="header-top1">
        <div className='header-container'>
          <div className="wrapper flexitem">
            <div className="left">
              <ul className="flexitem main-links">
                <li><a href="#">+91 99667 37466</a></li>
                <li><a href="">Giftshoppe711@gmail.com</a></li>
                <li><a href="">My Orders</a></li>
                <li><a href="">Track your Order</a></li>
                <li><a href="">Welcome</a></li>
              </ul> 
            </div>
            <div className="right">
              <ul>
                <li className="flexitem main-links">
                  <li><a href="#">ID₹ <span className="icon-small"><i class="fas fa-chevron-down"></i></span></a>
                    <ul>
                      <li className="current"><a href="#">IDR</a></li>
                      <li><a href="#">USD</a></li>
                      <li><a href="#">EURO</a></li>
                      <li><a href="#">GBP</a></li>
                    </ul>
                  </li>
                  <li><a href="#">English</a><span class="icon-small"><i class="fas fa-chevron-down"></i></span>
                    <ul>
                      <li className="current"><a href="#">English</a></li>
                      <li><a href="#">Telugu</a></li>
                      <li><a href="#">Hindi</a></li>
                      <li><a href="#">Tamil</a></li>
                    </ul>
                  </li>
                  <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                  <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                  <li><a href="https://www.instagram.com/giftshoppe2021/?igshid=ZDdkNTZiNTM%3D"><i class="fab fa-instagram"></i></a></li>
                  <li><a href="#"><i class="fab fa-pinterest"></i></a></li>
                  <li><a href="#"><i class="fab fa-youtube"></i></a></li>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </section>
    <div className='header'>
        <a href="#"><img className='logo' src="/img/logo.jpg"  alt="" width="80" height="80" />
        </a>
    <div className='header-search'>
        <input className='header-searchInput' type='text' />
        <SearchIcon className='header-SearchIcon' />
    </div>
    <div className='header-nav'>
        <ul id="navbar">
          <li><a className="active" href="index.html">Home</a></li>
          <li>
            <a href="shop.html"><i class="fa-solid fa-shop">Shop</i></a>
          </li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
          <div id="login"></div>
          <li><a href="/login.html"><i class="fal fa-user"></i></a></li>
          <li><a  href="/wishlist.html"><i class="fal fa-heart"></i></a></li>
          <li id="lg-bag">
            <a href="cart.html"><i class="fal fa-shopping-bag"></i></a>
          </li>
          <li>
            <div className="icon-text">
              <div className="mini-text">Total</div>
              <div className="cart-total">₹0.00</div>
            </div>
          </li>
          <a href="#" id="close"><i class="far fa-times"></i></a>
        </ul>
      </div>
        <div id="mobile">
        <a href="cart.html"><i class="fal fa-shopping-bag"></i></a>
        <i id="bar" class="fas fa-outdent"></i>
        </div>
    </div>
    </>
  )
}

export default header
