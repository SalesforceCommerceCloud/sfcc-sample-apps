import { Image } from '../src/api/models/Image';

describe('Product API Image model', () => {
  it('should return a new image model', () => {
    const img = new Image({
      title: 'Big Coat',
      alt: 'Large Coat',
      link: 'mylink',
      style: 'background-color: red'
    });
    expect(img.title).toEqual('Big Coat');
  });
});
