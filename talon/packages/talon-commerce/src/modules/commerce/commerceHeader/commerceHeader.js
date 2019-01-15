import { LightningElement, api, track } from 'lwc'
import { getRoute, subscribe } from "talon/routingService";

//export default { registerRoutes, getRouteUrl, getRoute, navigateToRoute, subscribe, setRouter };

// import { Link } from 'react-router-dom';
//
// import logo from './../logo.svg';
//
// import Navigation from './Navigation';
// import SearchBar from './SearchBar';
// import HeaderCart from './HeaderCart';


export default class CommerceHeader extends LightningElement {

    @track logo;

    @api test;
    subscription;

    constructor () {
        super();
        this.logo = '/assets/images/logo.svg';
        this.subscription = subscribe({
            next: this.routeSubHandler.bind(this)
        });
    }

    routeSubHandler(view) {
        console.log(view);
    }

    connectedCallback () {
        console.log('CommerceHeader connectedCallback()')
    }

    renderedCallback () {
        console.log('CommerceHeader renderedCallback()', this.test)
    }

    disconnectedCallback() {
        this.subscription.unsubscribe();
    }
}

/**
 * Header component that should show up in every page
 */
// class Header extends LightningElement {
//
//   connectedCallback() {
//     // hack to fix logo after server side rendering, on the server it is just '{}'
//     this.logo.src = logo;
//   }
//
//   render() {
//     return (
//       <div>
//         <header>
//           <nav>
//             <div className='header container'>
//               <div className='row'>
//                 <div className='col-12'>
//                   <div className='navbar-header brand'>
//                     <Link to='/'><img src={logo} className='logo' alt='logo' ref={logo => (this.logo = logo)} /></Link>
//                   </div>
//                   <div className='navbar-header'>
//                     <div className='pull-right'>
//                       <SearchBar />
//                       <HeaderCart />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className='main-menu navbar-toggleable-sm menu-toggleable-left multilevel-dropdown'>
//               <Navigation />
//             </div>
//           </nav>
//         </header>
//       </div>
//     );
//   }
// }
//
// export default Header;
