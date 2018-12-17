import {mount} from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import Nav from '../Components/Nav'
import {CURRENT_USER_QUERY} from '../Components/User'
import {fakeUser, fakeCartItem} from '../lib/testUtils'

const notSignedInMocks = [
    {
        request: {query: CURRENT_USER_QUERY},
        result: {data: {me:null} },
    },
];

const signedInMocks = [
    {
        request: {query: CURRENT_USER_QUERY},
        result: {data: {me: fakeUser()}
    },
];

const signedInMocksWithCartItems = [
    {
        request: {query:CURRENT_USER_QUERY},
        result: {
            data: {
                me:{
                    ...fakeUser,
                    cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
                },
            },
    },
];


describe('<Nav/>', () => {
    it('renders a minimal name when signed out', async() => {
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <Nav/>
            </MockedProvider> 
        );

        await wait();
        wrapper.update();
        //console.log(wrapper.debug());
        const nav = wrapper.find('url[data-test="nav"]');
        expect(toJSON(nav)).toMatchedSnapshot();
    });

    it('renders full nav when signed in', async() => {
        const wrapper = mount(
            <MockedProvider mocks={SignedInMocks}>
                <Nav/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const nav = wrapper.find('ul[date-test="nav"]');
        expect(nav.children().length).toBe(6);
        expect(nav.text()).toContain('Sign Out');
    });

    it('renders the amount of items in the cart', async() => {
        const wrapper = mount(
            <MockedProvider mocks={signedInMocks}>
                <Nav/>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        const nav = wrapper.find('[data-test="nav"]');
        const count = nav.find('div.count');
        expect(toJSON(count)).toMatchSnapshot();
    });
});



