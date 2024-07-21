import React from 'react'
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function header() {
  return (
    <>
    <div class="flex justify-end h-auto py-4 bg-[#e3e6f3] grid-cols-2 divide-x shadow-xl shadow-black opacity-100">
      <ul class="flex items-center">
        <li>
          <a
            href="/orders.js"
            class="text-sm text-sky-700  hover:underline decoration-2  px-2 py-1 rounded-md hover:text-[#088178] font-semibold"
            >My Orders</a>
        </li>
        <li>
          <a
            href="/track.js"
            class="text-sm text-sky-700  hover:underline decoration-2  px-2 py-1 rounded-md hover:text-[#088178] font-semibold"
            >Track your Order</a>
        </li>
        <li>
          <p class="cursor-pointer">
            <span class="material-icons"> account_circle </span>
          </p>
          <ul id="opne-dropdown" class="hidden">
            <li>
              <a href="contact.js" class="text-sm text-sky-700">+91 99667 37466</a>
            </li>
            <li>
              <a href="contact.js" class="text-sm text-sky-700"
                >Giftshoppe711@gmail.com</a
              >
            </li>
          </ul>
        </li>
      </ul>
      <ul class="flex">
        <li class="">
           <li>
              <a href="currency.js">ID₹ <span class="icon-small"><i class="fas fa-chevron-down"></i></span></a>
              <ul>
                <li class="current"><a href="idr.js">IDR</a></li>
                <li><a href="usd.js">USD</a></li>
                <li><a href="euro.js">EURO</a></li>
                <li><a href="gbp.js">GBP</a></li>
              </ul>
            </li>
            <li><a href="index.js">English</a><span class="icon-small"><i class="fas fa-chevron-down"></i></span>
              <ul>
                <li class="current"><a href="english">English</a></li>
                <li><a href="telugu.js">Telugu</a></li>
                <li><a href="hindi.js">Hindi</a></li>
                <li><a href="tamil.js">Tamil</a></li>
              </ul>
            </li>
        </li>
      </ul>
    </div>
    <div className='header'>
        <a href="index.js"><img className='logo' src="/img/logo.jpg"  alt="" width="80" height="80" />
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
          <a href="close.js" id="close"><i class="far fa-times"></i></a>
        </ul>
      </div>
        <div id="mobile">
        <a href="cart.html"><i class="fal fa-shopping-bag"></i></a>
        <i id="bar" class="fas fa-outdent"></i>
        </div>
    </div>
    </>
  );
}

export default header
