'use strict';

class Image {
    constructor(image) {
        this.title = image.title;
        this.alt = image.alt;
        this.link = image.link;
        this.style = `background: url(${image.link});`;
    }
}
export default Image;