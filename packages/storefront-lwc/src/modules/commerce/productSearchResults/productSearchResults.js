import { LightningElement, wire, track } from 'lwc'
import { getRoute, subscribe } from 'webruntime/routingService';
import { productsByQuery } from 'commerce/data';


/**
 * Displays search results
 */
export default class Search extends LightningElement {

    @track state = {};
    @track products = [];
    @track refinements = [];
    @track query = '';
    @track loading = false;
    @track refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
    @track showRefinementBar = true;

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

    @wire(productsByQuery, {query: '$query', sortRule: '$sortRule', selectedRefinements: '$selectedRefinements'})
    updateProducts(json) {

        console.log(this.query);
        console.log('===============================');
        console.log('API', (json.data && json.data.productSearch) ? json.data.productSearch : 'no results or query');
        console.log('===============================');

        if (json.data && json.data.productSearch) {
            this.products = json.data.productSearch.productHits || [];
            this.refinements = json.data.productSearch.refinements || [];

            Object.keys(this.selectedRefinements).forEach(refinement => {
                this.selectedRefinements[refinement].forEach(value => {

                    const curRefinement = json.data.productSearch.refinements.filter(ref => {
                        return ref.attributeId === refinement;
                    });

                    if (curRefinement && curRefinement.length === 1 && curRefinement[0].values) {
                        curRefinement[0].values.forEach(newValue => {
                            if (newValue.value === value) {
                                newValue.isSelected = true;
                            }
                        })
                    }
                })
            });
        } else {
            this.products = [];
            this.refinements = [];
        }
        this.loading = false;

    };

    constructor() {
        super();

        this.routeSubscription = subscribe(this.routeSubHandler.bind(this));

        // Listen to search query from header search component
        window.addEventListener('update-query-event', e => {
            this.loading = (e.detail && e.detail.query !== this.query);
        });

        window.addEventListener('toggle-refinement', e => {
            this.toggleRefinement(e.detail.refinement, e.detail.value);
        });

        this.updateSortOptions('best-matches');
    }

    routeSubHandler(view) {
        // Set query to trigger search.
        this.query = view.attributes.query;
    }

    hasQuery() {
        return !!this.query;
    }

    hasProducts() {
        return !!this.products && !!this.products.length;
    }

    /**
     * Handles a refinement click
     */
    toggleRefinement = (refinement, value) => {
        this.selectedRefinements[refinement] = this.selectedRefinements[refinement] || [];
        const index = this.selectedRefinements[refinement].indexOf(value);
        let isSelected = index === -1;
        if (isSelected) {
            if (refinement !== 'cgid') {
                this.selectedRefinements[refinement].push(value);
            } else {
                this.selectedRefinements[refinement][0] = value;
            }
        } else {
            this.selectedRefinements[refinement].splice(index, 1);
        }

        this.selectedRefinements = Object.assign({}, this.selectedRefinements);
    };

    updateSortOptions(newSortRuleId) {
        this.sortRule = this.sortOptions[0];

        this.sortOptions.forEach(option => {
            if (option.id !== newSortRuleId && option.selected) {
                option.selected = null;
                delete option.selected;
            } else if (option.id === newSortRuleId) {
                option.selected = 'selected';
                this.sortRule = option;
            }
        });
    };

    newSortRule = (event) => {
        const newSortRule = event.target.value;
        this.updateSortOptions(newSortRule);
    };

    renderedCallback() {
        // TODO: ugh. why is LWC stripping 'option[selected]' attribute?
        setTimeout(() => {
            const sortSelect = this.template.querySelector('select[name=sort-order]');
            if (sortSelect && sortSelect[0]) {
                const option = sortSelect.querySelector(`option[class=${this.sortRule.id}]`);
                if (option) {
                    option.setAttribute('selected', 'selected');
                }
            }
        })
    };

    resetRefinements = () => {
        this.selectedRefinements = {};
        this.sortRule = this.sortOptions[0];
    };

    toggleRefinementBar() {
        if (this.showRefinementBar) {
            this.refinementBar = 'refinement-bar col-md-3 d-lg-block';
        } else {
            this.refinementBar = 'refinement-bar col-md-3 d-none d-lg-block';
        }

        this.showRefinementBar = !this.showRefinementBar;
    };
}
