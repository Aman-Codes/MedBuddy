let footer = $(`
<div class="waves">
    <svg viewBox="0 0 120 21">
    <defs> 
    <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="
            1 0 0 0 0  
            0 1 0 0 0  
            0 0 1 0 0  
            0 0 0 13 -9" result="goo" />
        <xfeBlend in="SourceGraphic" in2="goo" />
    </filter>
        <path id="wave" d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z" />
    </defs> 
    <use id="wave3" class="wave" xlink:href="#wave" x="0" y="-2" ></use> 
    <use id="wave2" class="wave" xlink:href="#wave" x="0" y="0" ></use>
    <g class="gooeff" filter="url(#goo)">
    <circle class="drop drop1" cx="20" cy="2" r="8.8"  />
    <circle class="drop drop2" cx="25" cy="2.5" r="7.5"  />
    <circle class="drop drop3" cx="16" cy="2.8" r="9.2"  />
    <circle class="drop drop4" cx="18" cy="2" r="8.8"  />
    <circle class="drop drop5" cx="22" cy="2.5" r="7.5"  />
    <circle class="drop drop6" cx="26" cy="2.8" r="9.2"  />
    <circle class="drop drop1" cx="5" cy="4.4" r="8.8"  />
    <circle class="drop drop2" cx="5" cy="4.1" r="7.5"  />
    <circle class="drop drop3" cx="8" cy="3.8" r="9.2"  />
    <circle class="drop drop4" cx="3" cy="4.4" r="8.8"  />
    <circle class="drop drop5" cx="7" cy="4.1" r="7.5"  />
    <circle class="drop drop6" cx="10" cy="4.3" r="9.2"  />
    
    <circle class="drop drop1" cx="1.2" cy="5.4" r="8.8"  />
    <circle class="drop drop2" cx="5.2" cy="5.1" r="7.5"  />
    <circle class="drop drop3" cx="10.2" cy="5.3" r="9.2"  />
    <circle class="drop drop4" cx="3.2" cy="5.4" r="8.8"  />
    <circle class="drop drop5" cx="14.2" cy="5.1" r="7.5"  />
    <circle class="drop drop6" cx="17.2" cy="4.8" r="9.2"  />
    <use id="wave1" class="wave" xlink:href="#wave" x="0" y="1" />
    </g>  
    </svg>
</div>
<footer id="footer">
    <div class="container">
    <div class="row">
        <div class="col-lg-6 col-md-4 footer-logo"> 
            <img data-src="assets/Images/logo/logo.png" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Girl Script Chennai Chapter Logo" class="logo" aria-label="Girl Script Chennai Chapter Logo">
        </div>
        <div class="col-lg-6 col-md-8 mb-5" id="footer-c">		
        <br> 
        <h3 class="footer-h">Join Our Newsletter</h3>
        <div class="border"></div>
        <p class="footer-p">Enter Your Email to get our news and updates.</p>
        <form action="" class="newsletter-form" name="footermail" method="post" >
        <input type="email" id="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" name="email" class="txtb mr-2 mb-2 mt-4" placeholder="Enter Your Email" required >		   
        <button class="btn btn-spl" type="submit">Send</button>
        </form>
        </div>
    </div>
    <center>

            <div class="social-media">
            <a class="fa fa-twitter"  href="https://twitter.com/girlscriptch"></a>
            <a class="fa fa-instagram" href="https://www.instagram.com/girlscriptchennai/"></a>
            <a class="fa fa-github" href="https://github.com/girlscriptchennai"></a>
            <a class="fa fa-linkedin" href="https://www.linkedin.com/company/girlscript-chennai/"></a>
            </div>
            <h6 class="footer-h3">Made with â™¥</h6>
        </center>
    </div>		
</footer>
`);