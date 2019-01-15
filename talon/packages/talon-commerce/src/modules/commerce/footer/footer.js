import { LightningElement } from 'lwc'
// import PropTypes from 'prop-types';
// import { fetchContents } from '../data/store';
// import './../commerce-static/css/homePage.css';

/**
 * Header component that should show up in every page
 */
export default  class Footer extends LightningElement {

  constructor() {
    super();

    // this.state = {
    //   content: [],
    //   loading: false
    // };
  }

  // fetchContent() {
  //   this.setState({
  //     loading: true
  //   });
  //   // check if we have initial state from the server
  //   if (this.props.staticContext && this.props.staticContext.initData) {
  //     this.props.staticContext.initData.forEach(apiData => {
  //       if (apiData._type === 'content_result') {
  //         this.setState({
  //           content: apiData.data || [],
  //           loading: false
  //         });
  //       }
  //     });
  //   } else {
  //     fetchContents(['footer-locate-store', 'footer-account', 'footer-support', 'footer-about', 'footer-social-email', 'footer-copy'])
  //       .then(json => {
  //         this.setState({
  //           content: json.data || [],
  //           loading: false
  //         });
  //       })
  //       .catch(e => {   // eslint-disable-line no-unused-vars
  //         this.setState({
  //           loading: false
  //         });
  //       });
  //   }
  // }

  // componentWillMount() {
  //   this.fetchContent();
  // }

  // render() {
  //
  //   const mainContentIDs = ['footer-locate-store', 'footer-account', 'footer-support', 'footer-about'];
  //   const mainContent = this.state.content.filter(asset => mainContentIDs.includes(asset.id));
  //   const secContentIDs = ['footer-social-email', 'footer-copy'];
  //   const secContent = this.state.content.filter(asset => secContentIDs.includes(asset.id));
  //
  //   return (
  //     <footer>
  //       <div className="container">
  //         <div className="footer-container row">
  //           {mainContent.map(content => (
  //             <div className="footer-item col-sm-3 store" key={content.id}>
  //               <div
  //                 className="content-asset"
  //                 dangerouslySetInnerHTML={{ __html: content.c_body }}
  //               />
  //             </div>
  //           ))}
  //         </div>
  //         <hr className="hidden-xs-down" />
  //         <div className="row">
  //           {secContent.map(content => (
  //             <div className="col-lg-4 col-sm-5 push-sm-7 push-lg-8" key={content.id}>
  //               <div
  //                 className="content-asset"
  //                 dangerouslySetInnerHTML={{ __html: content.c_body }}
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </footer>
  //   );
  // }
}


// Footer.propTypes = {
//   staticContext: PropTypes.shape({
//     initData: PropTypes.array.isRequired
//   })
// };
