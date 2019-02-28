import { LightningElement, wire, track } from 'lwc'
import { getRoute, subscribe } from "talon/routingService";
import { productsByQuery } from "commerce/data";

// import './../../commerce-static/css/search.css';

/**
 * Displays search results
 */
export default class Search extends LightningElement {

    @track state = {};
    @track products = [];
    @track refinements = [];
    @track query = '';
    @track loading = false;
    sortRule;
    selectedRefinements = {};
    routeSubscription;

    @track sortOptions = [
        {id: 'best-matches', label: 'Best Matches'},
        {id: 'price-low-to-high', label: 'Price Low To High'},
        {id: 'price-high-to-low', label: 'Price High to Low'},
        {id: 'product-name-ascending', label: 'Product Name A - Z'},
        {id: 'product-name-descending', label: 'Product Name Z - A'},
        {id: 'most-popular', label: 'Most Popular'},
        {id: 'top-sellers', label: 'Top Sellers'}
    ];

    @wire( productsByQuery, {query: '$query', sortRule: '$sortRule', selectedRefinements: '$selectedRefinements'} )
    updateProducts( json ) {

        console.log(this.query)
        console.log( '===============================' );
        console.log( 'API', json.hits);
        console.log( '===============================' );


        this.products = json.hits || []
        this.loading = false;

    };

    constructor() {
        super();

        this.routeSubscription = subscribe( {
            next: this.routeSubHandler.bind( this )
        } );

        // Listen to search query from header search component
        window.addEventListener( 'update-query-event', e => {
            this.loading = true;
            // this.query = e.detail.query;
        } );

        window.addEventListener( 'toggle-refinement', e => {
            this.toggleRefinement( e.detail.refinement, e.detail.value );
        } );

        this.updateSortOptions( 'best-matches' );
    }

    routeSubHandler( view ) {
        // TODO: need better way to get param from routingService

        // Defer for now
        setTimeout(() =>{
            const url = window.location.pathname;

            // get query from param
            const queryParam = url.split('/search/')[1];

            this.query = '' + queryParam;

            console.log( '========================================');
            console.log( 'route update. getRouteUrl', this.query);
            console.log( 'route update. getRouteUrl', this.products);
            console.log( 'route update. need to trigger search if query', view );
            console.log( '========================================');
        })
    }

    disconnectedCallback() {
        this.routeSubscription.unsubscribe();
    }

    hasQuery() {
        return !!this.query;
    }

    hasProducts() {
        return !!this.products && !!this.products.length;
    }

    connectedCallback() {
        console.log( 'ProductSearchResults.connectedCallback()' )
    }

    /**
     * Handles a refinement click
     */
    toggleRefinement = ( refinement, value ) => {
        this.selectedRefinements[ refinement ] = this.selectedRefinements[ refinement ] || [];
        const index = this.selectedRefinements[ refinement ].indexOf( value );
        let isSelected = index === -1

        if (isSelected) {
            this.selectedRefinements[ refinement ].push( value );
        } else {
            this.selectedRefinements[ refinement ].splice( index, 1 );
        }

        this.selectedRefinements = Object.assign( {}, this.selectedRefinements );
    };

    updateSortOptions( newSortRuleId ) {
        this.sortRule = this.sortOptions[ 0 ];

        this.sortOptions.forEach( option => {
            if (option.id !== newSortRuleId && option.selected) {
                option.selected = null;
                delete option.selected;
            } else if (option.id === newSortRuleId) {
                option.selected = 'selected';
                this.sortRule = option;
            }
        } );

    }

    newSortRule = ( event ) => {
        const newSortRule = event.target.value;
        this.updateSortOptions( newSortRule );
    }

    renderedCallback() {
        // TODO: ugh. why is LWC stripping 'option[selected]' attribute?
        setTimeout( () => {
            const sortSelect = this.template.querySelector( 'select[name=sort-order]' );
            if (sortSelect && sortSelect[ 0 ]) {
                const option = sortSelect.querySelector( `option[class=${this.sortRule.id}]` );
                if (option) {
                    option.setAttribute( 'selected', 'selected' );
                }
            }
        } )
    }


    resetRefinements = () => {
        this.selectedRefinements = {};
        this.sortRule = this.sortOptions[ 0 ];
    }

    renderedCallback() {
        console.log( 'ProductSearchResults renderedCallback()' );
    }

    //
    // render() {
    //   const sortOptions = [
    //     { id: 'best-matches', label: 'Best Matches' },
    //     { id: 'price-low-to-high', label: 'Price Low To High' },
    //     { id: 'price-high-to-low', label: 'Price High to Low' },
    //     { id: 'product-name-ascending', label: 'Product Name A - Z' },
    //     { id: 'product-name-descending', label: 'Product Name Z - A' },
    //     { id: 'most-popular', label: 'Most Popular' },
    //     { id: 'top-sellers', label: 'Top Sellers' }
    //   ];
    //
    //   return (
    //     <div className='container search-results'>
    //       <div className='row search-nav'></div>
    //       <div className='row'>
    //         <div className='tab-content col-12'>
    //           <div className='tab-pane container active' id='product-search-results' aria-expanded='true'>
    //             <div className='row grid-header'>
    //               <div className='result-count text-center col-12 col-md-9 col-sm-6 order-sm-2'>
    //                 <p>
    //                   <span>{this.state.products.length} Results for </span>
    //                   <span className='search-keywords'>{match.params.query || ''}</span>
    //                 </p>
    //               </div>
    //               <div className='col-6 col-sm-3 order-sm-1'>
    //                 <select className='custom-select'
    //                   name='sort-order'
    //                   value={this.state.sortRule}
    //                   onChange={this.newSortRule}>
    //                   {sortOptions.map(sortOption => (
    //                     <option key={sortOption.id}
    //                       className={sortOption.id}
    //                       value={sortOption.id}
    //                       label={sortOption.label}>
    //                     </option>
    //                   ))}
    //                 </select>
    //               </div>
    //             </div>
    //
    //             {this.state.products.length > 0 &&
    //               <div className='row'>
    //                 <div className='refinement-bar col-md-3'>
    //                   <div className='secondary-bar col-12 offset-sm-4 offset-md-0 col-sm-4 col-md-12'>
    //                     <div className='reset btn btn-block btn-outline-primary'
    //                       onClick={this.resetRefinements}>
    //                       Reset
    //                     </div>
    //                   </div>
    //
    //                   <aside>
    //                     <div className='refinements'>
    //                       {this.state.refinements.map(refinement => (
    //                         <Refinement
    //                           key={refinement.label}
    //                           refinement={refinement}
    //                           toggleRefinement={this.toggleRefinement}
    //                           selectedValues={
    //                             this.state.selectedRefinements[refinement.attribute_id]
    //                           }
    //                         />
    //                       ))}
    //                     </div>
    //                   </aside>
    //                 </div>
    //
    //                 <div className='col-sm-12 col-md-9'>
    //                   <div className='container'>
    //                     <ProductList products={this.state.products} />
    //                   </div>
    //                 </div>
    //               </div>
    //             }
    //           </div>
    //         </div>
    //         <div className={'lmask' + (!this.state.loading ? ' js-hidden' : '')} />
    //       </div>
    //     </div>
    //   );
    // }
}

// Search.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired
//   }).isRequired,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       query: PropTypes.string
//     }).isRequired,
//   }).isRequired,
//   staticContext: PropTypes.shape({
//     initData: PropTypes.array.isRequired
//   })
// };
