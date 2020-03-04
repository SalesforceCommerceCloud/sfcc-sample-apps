class Imager {
    constructor(image) {
        this.title = image.title;
        this.alt = image.alt;
        this.link = image.disBaseLink || image.link;
        this.style = `background: url(${this.link});`;
    }
}
export default Imager;
