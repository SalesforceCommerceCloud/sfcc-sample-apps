import { LightningElement } from 'lwc'
// import PropTypes from 'prop-types';
import { fetchContents } from 'commerce/data';
// import './../sfra-static/css/homePage.css';

/**
 * Homepage component. Renders homepage content.
 */
class Home extends LightningElement {

    content;
    tmpl;

    constructor() {
        super();

        // this.state = {
        //   content: [],
        //   loading: false
        // };
    }

    connectedCallback() {
        fetchContents( [ 'home-main', 'home-categories' ] )
            .then( json => {
                console.log( json );
                if (json.data && json.data.length ) {
                    json.data.forEach(data => {
                        const container = this.template.querySelector('.container');
                        container.innerHTML += data.c_body;
                    })
                }
            } )
            .catch( e => {   // eslint-disable-line no-unused-vars
                console.log( e )
            } );
    }

    renderedCallback(){
        // const tmpl = this.template.querySelector('.container');
        // tmpl.innerHTML = 'rendered';
    }

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
    //     fetchContents(['home-main', 'home-categories'])
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

    // componentDidUpdate() {
    //   const first = document.getElementsByClassName('hero main-callout')[0];
    //   if (first) {
    //     first.getElementsByTagName('h1')[0].innerHTML = 'Headless Commerce';
    //   }
    // }

    // render() {
    //   return (
    //     <div>
    //       {this.state.content.map(content => (
    //         <div
    //           className='container'
    //           key={content.id}
    //           dangerouslySetInnerHTML={{ __html: content.c_body }}
    //         />
    //       ))}
    //     </div>
    //   );
    // }
}

export default Home;

// Home.propTypes = {
//   staticContext: PropTypes.shape({
//     initData: PropTypes.array.isRequired
//   })
// };
