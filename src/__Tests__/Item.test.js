import ItemComponent from '../components/Item';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id:'ABC123',
    title:'A ool item',
    price: 4000,
    description: 'this item is nice',
    image:'dog.jpg',
    largeImage:'largedog.jpg',
};

describe('<Item/>', () => {
    it('renders and matches the snapshot', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        expect(toJSON(wrapper)).toMatchSnapshot();
    });

    it('renders the image properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        const img = wrapper.find('img');
          //console.log(wrapper.debug());
        expect(img.props().src).toBe(fakeItem.image);
        expect(img.props().alt).toBe(fakeItem.title);
    });
//.div() renders a level deapper
    it('renders the pricetag andd title', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        const PriceTag = wrapper.find('PriceTag');
        expect(PriceTag.children().text()).toBe('$40');
        expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
    });

    it('renders out the buttons properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        const buttonList = wrapper.find('.buttonList');

        expect(buttonList.children()).toHaveLength(3);
        expect(buttonList.find('Link')).toHaveLength(1);
        expect(buttonList.find('AddToCart').exists()).toBe(true);
        expect(buttonList.find('DeleteItem').exists()).toBe(true);
    });
});